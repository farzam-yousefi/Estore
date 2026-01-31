// types/client/category.ts
export type CategoryClient = {
  _id: string;
  name: string;
  slug: string;
  baseProperties: {
    name: string;
    label: string;
    type: "string" | "number" | "boolean" | "date";
    required: boolean;
    options?: string[];
  }[];
};
