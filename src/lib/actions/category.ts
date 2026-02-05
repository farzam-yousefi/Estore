"use server";
import { Category, CategoryProperty, PropertyType } from "@/types/db/dbtypes";
import { CategoryFormSchema, CategoryFormSchemaWithoutProp } from "../rules";
import { uploadImage } from "../uploadImg";
import { deleteDocument, getCollection, insertInCollection } from "../db";
import { CategoryClient } from "@/types/dto/clientTypes";
import { ObjectId } from "mongodb";
export type State = {
  message: string;
  errors?: CategoryErrors;
  defaultValues?: {
    catName?: string;
    catSlug?: string;
    catImage?: string;
    properties?: CategoryProperty[];
  };
};

type CategoryErrors = {
  name?: string;
  slug?: string;
  image: string | null;
  properties?: {
    name?: string;
    label?: string;
    type?: string;
  }[];
};

type imgObject = {
  imgPath: string | null;
  imgErr: string | null;
};

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

async function extractDateForm(
  formData: FormData,
): Promise<{ catObject: Category; imgErr: string | null }> {
  const catName: string = formData.get("catName") as string;
  const catSlug = formData.get("catSlug") as string;

  const properties = parseProperties(formData);
  const file = formData.get("image") as File | null;
  const oldImage = formData.get("existingImage") as string | null;

  let image_: imgObject = { imgPath: null, imgErr: null };

  if (file && file.size > 0) {
    image_ = await uploadImage(file, catSlug, { folder: "categories" });
  } else if (oldImage) {
    image_.imgPath = oldImage.replace("/uploads/categories/", "");
  }

  // if (file) image_ = await uploadImage(file, catSlug, { folder: "categories" });

  const catObject = {
    name: catName,
    slug: catSlug,
    image: image_.imgPath,
    baseProperties: properties,
  };
  return {
    catObject,
    imgErr: image_.imgErr,
  };
}

async function validatingfunction(
  prevState: State | null,
  catObject: Category,
  imgErr: string | null,
): Promise<State | null> {
  const hasProperties = catObject.baseProperties?.length > 0;
  const catName = catObject.name;
  const catSlug = catObject.slug;
  const properties = catObject.baseProperties;
  const validated = hasProperties
    ? CategoryFormSchema.safeParse({ catName, catSlug, properties })
    : CategoryFormSchemaWithoutProp.safeParse({ catName, catSlug });

  if (!validated.success || imgErr) {
    if (!validated.success) {
      const f = validated.error.format();

      type ZodFormattedArrayErrors = Record<
        number,
        {
          name?: { _errors?: string[] };
          label?: { _errors?: string[] };
          type?: { _errors?: string[] };
        }
      > & { _errors?: string[] };

      const propErrors: CategoryErrors["properties"] = [];
      if (hasProperties && "properties" in f) {
        const propErrorMap =
          f?.properties as unknown as ZodFormattedArrayErrors;

        for (const key in propErrorMap) {
          if (key === "_errors") continue;

          const index = Number(key);
          const p = propErrorMap[index];

          propErrors[index] = {
            name: p?.name?._errors?.[0],
            label: p?.label?._errors?.[0],
            type: p?.type?._errors?.[0],
          };
        }
      }

      return {
        message: "Validation failed",
        errors: {
          name: f.catName?._errors?.[0],
          slug: f.catSlug?._errors?.[0],
          image: imgErr,
          properties: propErrors,
        },
        defaultValues: {
          catName,
          catSlug,
          catImage: `/uploads/categories/${catObject.image}`,
          properties,
        },
      };
    }

    return {
      message: "Validation failed",
      errors: {
        image: imgErr,
      },
      defaultValues: {
        catName,
        catSlug,
        catImage: `/uploads/categories/${catObject.image}`,
        properties,
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
  const { catObject, imgErr } = await extractDateForm(formData);
  const result = await validatingfunction(prevState, catObject, imgErr);

  if (result) return result;

  await insertInCollection("categories", catObject);

  return {
    message: "Category was added successfully",
    errors: undefined,
    defaultValues: {
      catName: undefined,
      catSlug: undefined,
      catImage: undefined,
      properties: undefined,
    },
  };
}

export async function updateCategory(
  prevState: State | null,
  formData: FormData,
): Promise<State | null> {
  const catId = formData.get("catId") as string;

  const { catObject, imgErr } = await extractDateForm(formData);
  const result = await validatingfunction(prevState, catObject, imgErr);

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
    errors: undefined,
    defaultValues: {
      catName: undefined,
      catSlug: undefined,
      catImage: undefined,
      properties: undefined,
    },
  };
}
export async function deleteCategory(colName: string, _id: string) {
  await deleteDocument(colName, _id);
}
