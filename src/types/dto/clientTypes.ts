import { CategoryProperty, PropertyType } from "../db/dbtypes";

// types/client/category.ts
export type CategoryClient = {
  id: string;
  name: string;
  slug: string;
  image?:string|null;
  baseProperties: CategoryPropertyForm[];
};


export type SubCategoryClient = {
  id: string;
  name: string;
  slug :string;
  parentId: string | null;
  masterCategoryId: string;
  level: number;
  extraProperties?: CategoryPropertyForm[];
};


export type CategoryPropertyForm = {
  id?: string;
  name: string;
  label: string;
  type: PropertyType;
  required: boolean;
  options: string; // CSV string for input field
};
