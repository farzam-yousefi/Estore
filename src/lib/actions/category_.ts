import { PropertyType } from "@/types/db/dbtypes";
import { CategoryFormSchema } from "../rules";

export type State = {
  errors?: CategoryErrors,
  message: string | null,
 // defaultValues? :Omit<InvoiceForm,'id'>|null
 defaultValues?:{
    catName?: string;
    catSlug?: string;
    propName?: string;
    propLabel?: string;
    propType?:PropertyType;
    requizit?: boolean;
    options? :string
 }
};


type CategoryErrors = {
  name?: string;
  slug?: string;
  properties?: {
    name?: string;
    label?: string;
    type?: string;
  }[];
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

    options: p.options
      ? p.options
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean)
      : [],
  }));
}


export async function addCategory(prevState: State, formData: FormData) {
  const catName = formData.get("catName");
  const catSlug = formData.get("catSlug");

  const properties = parseProperties(formData);

  const validated = CategoryFormSchema.safeParse({
    catName,
    catSlug,
    properties,
  });

  // If any form fields are invalid
 


  if (!validated.success) {
    const f = validated.error.format();
 const propErrors =
    f.properties && !Array.isArray(f.properties)
      ? Object.values(f.properties).map((p: any) => ({
          name: p?.name?._errors?.[0],
          label: p?.label?._errors?.[0],
          type: p?.type?._errors?.[0],
        }))
      : [];
    return {
      message: "Validation failed",
     errors: {
      name: f.catName?._errors[0],
      slug: f.catSlug?._errors[0],
      properties: propErrors,
    },
    };
  }

return {
    message: "ok",
    errors: undefined,
  };
}