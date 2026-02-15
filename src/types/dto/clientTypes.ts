import { CategoryProperty } from "../db/dbtypes";

// types/client/category.ts
export type CategoryClient = {
  _id: string;
  name: string;
  slug: string;
  image?:string|null;
  baseProperties: {
    name: string;
    label: string;
    type: "string" | "number" | "boolean" | "date";
    required: boolean;
    options?: string[];
  }[];
};


export type SubCategoryClient = {
  _id: string;
  name: string;
  slug :string;
  parentId: string | null;
  masterCategoryId: string;
  level: number;
  extraProperties?: CategoryProperty[];
};