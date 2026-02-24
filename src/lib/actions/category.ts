"use server";
import { ObjectId } from "mongodb";
import { emptyCategory } from "@/components/CreateEditCategoryForm";
import {
  Category,
  CategoryProperty,
  imgObject,
  SubCategory,
} from "@/types/db/dbtypes";
import { uploadImage } from "../uploadImg";
import {
  CategoryFormSchema,
  CategoryFormSchemaWithoutProp,
  PropertySchema,
} from "../rules";
import {
  deleteDocument,
  getCollection,
  insertInCollection,
  mapDocToClient,
  selectDocWithId,
  toObjectId,
} from "../db";
import {
  CategoryClient,
  CategoryPropertyForm,
  SubCategoryClient,
} from "@/types/dto/clientTypes";

export type State = {
  message?: string;
  status?: boolean;
  data?: CategoryProperty[];
  errors?: CategoryErrors;
  defaultValues?: {
    catName?: string;
    catSlug?: string;
    catImage?: string;
    catProperties?: CategoryPropertyForm[];
  };
};

type CategoryErrors = {
  name?: string;
  slug?: string;
  image?: string | null;
  properties?: {
    name?: string;
    label?: string;
    type?: string;
  }[];
};

type generalInfo={
  name:string ,
   slug: string,
   image?: string | null,
    properties:CategoryProperty[]
}
function toCategoryPropertyForm(
  property: CategoryProperty,
): CategoryPropertyForm {
  return {
    id: property._id?.toString(),
    ...property,
  };
}
// function isCategory(obj: Category | SubCategory): obj is Category {
//   return "baseProperties" in obj;
// }

function parseProperties(formData: FormData) {
  const entries = Array.from(formData.entries());
  const map = new Map<number, any>();

  for (const [key, value] of entries) {
    const match = key.match(/^properties\[(\d+)\]\.(.+)$/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!map.has(index)) map.set(index, {});
    map.get(index)![field] = value;
  }

  return Array.from(map.values()).map((p) => ({
    name: p.name,
    label: p.label,
    type: p.type,
    required: p.required === "on",
    options: p.options,
  }));
}

async function extractDateForm(formData: FormData)
: Promise<{generalInfo:generalInfo , imgErr:string|null}> {

  const name: string = formData.get("catName") as string;
  const slug = formData.get("catSlug") as string;
  const properties = parseProperties(formData);
  const file = formData.get("image") as File | null;
  const oldImage = formData.get("existingImage") as string | null;

  let image_: imgObject = { imgPath: null, imgErr: null };

  if (file && file.size > 0) {
    image_ = await uploadImage(file, slug, { folder: "categories" });
  } else if (oldImage) {
    image_.imgPath = oldImage.replace("/uploads/categories/", "");
  }
  return {
    generalInfo
    :
    {name: name,
    slug: slug,
    image: image_.imgPath,
    properties: properties,
    },
    imgErr: image_.imgErr,
  };
}

async function extractDateForm_category(
  formData: FormData,
): Promise<{ catObject: Category; imgErr: string | null }> {
  const dataObject =await extractDateForm(formData);
  const catObject = {
    name: dataObject.generalInfo.name,
    slug: dataObject.generalInfo.slug,
    image: dataObject.generalInfo.image,
    baseProperties: dataObject.generalInfo.properties,
  }
  return{
    catObject:catObject,
    imgErr:dataObject.imgErr
  };
}
async function extractDateForm_subCat(
  formData: FormData,
): Promise<{ subcatObject: SubCategory; imgErr: string | null }> {
  const masterCategoryId = formData.get("catId") as string;
  const parentIdRaw = formData.get("parent") as string;
  const parentId = parentIdRaw ? toObjectId(parentIdRaw) : null;
  
   const dataObject =await extractDateForm(formData);
  const subcatObject = {
    name: dataObject.generalInfo.name,
    slug: dataObject.generalInfo.slug,
    image: dataObject.generalInfo.image,
    extraProperties: dataObject.generalInfo.properties,
     parentId,
    masterCategoryId: toObjectId(masterCategoryId),
    level: parentId ? 3 : 2,
  };
  return {
    subcatObject,
     imgErr:dataObject.imgErr
  };
}

export async function validateProperties(
  properties: CategoryPropertyForm[],
): Promise<CategoryErrors["properties"]> {
  const propErrors: CategoryErrors["properties"] = [];

  properties.forEach((prop, idx) => {
    const result = PropertySchema.safeParse(prop);
    if (!result.success) {
      const f = result.error.format();
      propErrors[idx] = {
        name: f.name?._errors?.[0],
        label: f.label?._errors?.[0],
        type: f.type?._errors?.[0],
      };
    }
  });
  return propErrors;
}

async function validatingFunction(
  catObject: Category | SubCategory,
  imgErr: string | null,
): Promise<State | null> {
  const catName = catObject.name;
  const catSlug = catObject.slug;
  const properties =
    "baseProperties" in catObject
      ? catObject.baseProperties
      : catObject.extraProperties;
  const hasProperties = properties && properties.length > 0;
  const validated = hasProperties
    ? CategoryFormSchema.safeParse({ catName, catSlug, properties })
    : CategoryFormSchemaWithoutProp.safeParse({ catName, catSlug });
  if (!validated.success || imgErr) {
    // Validate properties separately
    const propErrors = hasProperties
      ? await validateProperties(
          properties.map((p) => toCategoryPropertyForm(p)),
        )
      : [];
    return {
      message: "Validation failed",
      errors: {
        name: validated.success
          ? undefined
          : validated.error.format().catName?._errors?.[0],
        slug: validated.success
          ? undefined
          : validated.error.format().catSlug?._errors?.[0],
        image: imgErr,
        properties: propErrors,
      },
      defaultValues: {
        catName,
        catSlug,
        catImage: `/uploads/categories/${catObject.image}`,
        catProperties: properties.map((p) => toCategoryPropertyForm(p)),
      },
    };
  }
  return null;
}

export async function add_updateCategory(
  prevState: State | null,
  formData: FormData,
): Promise<State | null> {
  if (formData.get("catId") === "") return addCategory(prevState, formData);
  else return updateCategory(prevState, formData);
}

export async function addCategory(
  prevState: State | null,
  formData: FormData,
): Promise<State | null> {
  const { catObject, imgErr } = await extractDateForm_category(formData);
  const result = await validatingFunction(catObject, imgErr);

  if (result) return result;

  await insertInCollection("categories", catObject);

  return {
    message: "Category was added successfully",
    status: true,
    errors: undefined,
    defaultValues: {
      catName: undefined,
      catSlug: undefined,
      catImage: undefined,
      catProperties: undefined,
    },
  };
}

export async function updateCategory(
  prevState: State | null,
  formData: FormData,
): Promise<State | null> {
  const catId = formData.get("catId") as string;
  const { catObject, imgErr } = await extractDateForm_category(formData);
  const result = await validatingFunction(catObject, imgErr);

  if (result) return result;

  const collection = await getCollection("categories");

  await collection?.findOneAndUpdate(
    {
      _id: new ObjectId(catId),
    },
    {
      $set: {
        name: catObject?.name,
        slug: catObject?.slug,
        image: catObject?.image,
        baseProperties: catObject.baseProperties,
      },
    },
  );

  return {
    message: "Category was updateded successfully",
    status: true,
    errors: undefined,
    defaultValues: {
      catName: undefined,
      catSlug: undefined,
      catImage: undefined,
      catProperties: undefined,
    },
  };
}

export async function deleteCat_subCat(colName: string, _id: string) {
  await deleteDocument(colName, _id);
}

export async function getCategory(id: string): Promise<CategoryClient> {
  const category = await selectDocWithId<Category>("categories", id);

  if (!category) return emptyCategory;

  // Map the root document to client (convert _id -> id)
  const catClient = mapDocToClient(category);

  // Map baseProperties
  const baseProperties: CategoryPropertyForm[] =
    category.baseProperties?.map(toCategoryPropertyForm) ?? [];

  return {
    ...catClient,
    baseProperties,
  };
}

export async function getCategoriesWithCounts(): Promise<CategoryClient[]> {
  const collection = await getCollection<Category>("categories");
  const subCollection = await getCollection("subcategories");
  const categories = await collection.find().toArray();

  return Promise.all(
    categories.map(async (cat) => {
      const subCount = await subCollection.countDocuments({
        masterCategoryId: cat._id,
      });
      const baseProperties: CategoryPropertyForm[] = (
        cat.baseProperties ?? []
      ).map((p) => ({
        id: p._id?.toString(),
        name: p.name,
        label: p.label,
        type: p.type,
        required: p.required,
        options: p.options ?? "", // DB already stores string
        readOnly: false,
        insertInSub: false,
      }));

      return {
        id: cat._id!.toString(),
        name: cat.name,
        slug: cat.slug,
        image: cat.image ?? null,
        baseProperties,
        subCount,
      };
    }),
  );
}

export async function getSubcats(id: string): Promise<SubCategoryClient[]> {
  const collection = await getCollection<SubCategory>("subcategories");
  const data = await collection
    .find({ masterCategoryId: new ObjectId(id) })
    .toArray();
  return data.map((doc) => ({
    ...mapDocToClient(doc), // root document always has _id
    parentId: doc.parentId?.toString() ?? null,
    masterCategoryId: doc.masterCategoryId.toString(),
    extraProperties: doc.extraProperties?.map(toCategoryPropertyForm) ?? [],
  }));
}

export async function getSubCatsCount(id: string): Promise<number> {
  const collection = await getCollection<SubCategory>("subcategories");
  const count = await collection.countDocuments({
    masterCategoryId: new ObjectId(id),
  });
  return count;
}

export async function addSubcategory(
  prevState: State | null,
  formData: FormData,
): Promise<State | null> {
  const { subcatObject, imgErr } = await extractDateForm_subCat(formData);
  const parent = formData.get("parent") as string;
  const result = await validatingFunction(subcatObject, imgErr);
  if (result) return result;
  await insertInCollection("subcategories", subcatObject);
  return {
    message: "SubCategory was added successfully",
    status: true,
    errors: undefined,
    defaultValues: {
      catName: undefined,
      catSlug: undefined,
      catImage: undefined,
      catProperties: undefined,
    },
  };
}

export async function updateSubCategoryProperties(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const categoryId = formData.get("categoryId") as string;
  const subCategoryId = formData.get("subCategoryId") as string;
  const properties = JSON.parse(
    formData.get("properties") as string,
  ) as CategoryPropertyForm[];

  const result = await validateProperties(properties);
  if (result?.length && result.length > 0)
    return {
      message: "Validation failed",
      errors: {
        properties: result,
      },
      defaultValues: {
        catProperties: properties,
      },
    };

  const cleanedProperties: CategoryProperty[] = properties.map(
    ({ readOnly, insertInSub, errors, ...rest }) => rest,
  );

  try {
    const collection = await getCollection("subcategories");
    await collection.findOneAndUpdate(
      { _id: new ObjectId(subCategoryId) },
      { $set: { extraProperties: cleanedProperties } },
      { returnDocument: "after" },
    );
  } catch (e) {
    throw new Error("Update was failed");
  }
  return {
    status: true,
    data: cleanedProperties,
    message: "your change was saved successfully",
    errors: undefined,
    defaultValues: {
      catProperties: undefined,
    },
  };
}
