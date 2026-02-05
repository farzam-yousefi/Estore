import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
});

export const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(1, { message: "Not be empty" })
      .min(5, { message: "Be at least 5 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password fields do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export const PropertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  label: z.string().min(1, "Property label is required"),
  type: z.enum(["string", "number", "boolean", "date"]),
  required: z.boolean(),

  options: z.string().optional(),
});

export const CategoryFormSchema = z.object({
  catName: z.string().min(1, "Category name is required"),
  catSlug: z.string().min(1, "Slug is required"),
  properties: z.array(PropertySchema).min(1),
});

export const CategoryFormSchemaWithoutProp = z.object({
  catName: z.string().min(1, "Category name is required"),
  catSlug: z.string().min(1, "Slug is required"),
});
