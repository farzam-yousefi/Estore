"use client";
import { useActionState, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CategoryClient } from "@/types/dto/clientTypes";
import { add_updateCategory, State } from "@/lib/actions/category";
import { SuccessDialog } from "./CustomAlertDialog";
import { fakeFunction } from "@/lib/generalUtilities";
import GeneralInfo from "./GeneralCatInfo";
import GeneralCat_SubcatProps from "./GeneralCatProps";

export const emptyCategory: CategoryClient = {
  id: "",
  name: "",
  slug: "",
  image: null,
  baseProperties: [],
};

type CategoryDrawerProps = {
  activeCategory?: CategoryClient; // optional
  onCancel?: () => void; //optional
  onSuccess?: () => void; //optional
};

const initialState: State = {
  message: "",
  errors: undefined,
  defaultValues: undefined,
};

export default function CreateEditCategoryForm({
  props,
}: {
  props?: CategoryDrawerProps;
}) {
  const category = props?.activeCategory ?? emptyCategory;
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [properties, setProperties] = useState(category.baseProperties);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image || null,
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const onCancel = props?.onCancel ?? fakeFunction;

  const [state, formAction] = useActionState(add_updateCategory, initialState);

  // Update form values when validation fails
  useEffect(() => {
    if (state?.defaultValues) {
      setName(state.defaultValues.catName || "");
      setSlug(state.defaultValues.catSlug || "");
      setImagePreview(state.defaultValues.catImage || "");
      setProperties(state.defaultValues.catProperties || []);
    }
  }, [state?.defaultValues]);

  useEffect(() => {
    if (state?.status === true) {
      setShowSuccess(true);
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <Card className="max-w-4xl mx-auto">
          {category.id === "" && (
            <CardHeader>
              <CardTitle>Create Master Category</CardTitle>
            </CardHeader>
          )}
          <CardContent className="space-y-6">
            <input type="hidden" name="catId" value={category.id} />

            {/* General Info */}
            <GeneralInfo activeCategory={category} state={state} />

            {/* Properties */}
            <GeneralCat_SubcatProps
              errors={state?.errors?.properties}
              properties_={category.baseProperties}
            />

            {category.id === "" ? (
              <Button type="submit" className="w-full">
                Create Category
              </Button>
            ) : (
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            )}
          </CardContent>

          {/* General message */}
          {state?.message && (
            <div className="justify-center mx-auto">
              {state.message === "Validation failed" ? (
                <p className="mt-2 text-sm text-destructive">{state.message}</p>
              ) : state.message === "Category was added successfully" ? (
                <>
                  <p className="mt-2 text-sm text-green-600">{state.message}</p>

                  <Link href="/admin/categories">
                    <Button type="button" className="w-full mt-2">
                      Show Categories
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm text-green-600">{state.message}</p>
              )}
            </div>
          )}
        </Card>
      </form>

      <SuccessDialog
        open={showSuccess}
        description={state?.message}
        onClose={() => {
          setShowSuccess(false);
          onCancel(); // CLOSE DRAWER
          props?.onSuccess?.(); // refresh list
        }}
      />
    </>
  );
}
