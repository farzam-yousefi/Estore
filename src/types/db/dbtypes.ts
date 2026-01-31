import { ObjectId } from "mongodb";
export type PropertyType = "string" | "number" | "boolean" | "date";

export type CategoryProperty = {
  _id?: ObjectId;
  name: string;
  label: string;
  type: PropertyType;
  required: boolean;
  // min?: number;
  // max?: number;
  options?: string[];
};


export type Category = {
  _id: ObjectId;
  name: string;
  slug: string;
  baseProperties: CategoryProperty[];
};

export type SubCategory = {
  _id: ObjectId;
  name: string;
  parentId: ObjectId | null;
  masterCategoryId: ObjectId;
  level: number;
  extraProperties: CategoryProperty[];
};

export type Product = {
  _id: ObjectId;
  name: string;
  sku: string;//T-shirt (Blue, L) → SKU: TS-BLU-L    SKU: IP15-256GB-BLACK
  categoryId: ObjectId;
  price: number;
  currency: "USD" | "EUR" | "IRR";
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  images: string[];
  attributes: Record<string, string | number | boolean | Date>;
  createdAt: Date;
  updatedAt: Date;
  discount?: {
  type: "percent" | "amount";
  value: number;
  startDate?: Date;
  endDate?: Date;
};
};

export type GlobalDiscount = {
  _id: ObjectId;
  name: string;
  type: "percent" | "amount";
  value: number;

  appliesTo: {
    allProducts?: boolean;
    categoryIds?: ObjectId[];
    subCategoryIds?: ObjectId[];
  };

  startDate: Date;
  endDate: Date;
  isActive: boolean;
};

export type Coupon = {
  _id: ObjectId;
  code: string;               // "SAVE20"
  type: "percent" | "amount";
  value: number;

  minOrderAmount?: number;
  maxDiscountAmount?: number;

  usageLimit?: number;
  usedCount: number;

  applicableCategoryIds?: ObjectId[];
  applicableProductIds?: ObjectId[];

  startDate: Date;
  endDate: Date;
  isActive: boolean;
};




