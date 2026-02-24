"use client";
import { Check, ChevronsUpDown, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActionState, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import { addSubcategory, State } from "@/lib/actions/category";
import { SuccessDialog } from "./CustomAlertDialog";
import { fakeFunction } from "@/lib/generalUtilities";
import GeneralInfo from "./GeneralCatInfo";
import GeneralCat_SubcatProps from "./GeneralCatProps";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  CategoryPropertyForm,
  SubCategoryClient,
} from "@/types/dto/clientTypes";
import { emptyCategory } from "./CreateEditCategoryForm";

const initialState: State = {
  message: "",
  errors: undefined,
  defaultValues: undefined,
};

type CategoryDrawerProps = {
  activeCategory?: { id: string; name: string }; // optional
  onCancel?: () => void; //optional
  onSuccess?: () => void; //optional
  parents?: SubCategoryClient[];
};

export default function CreateSubCategoryForm({
  props,
}: {
  props?: CategoryDrawerProps;
}) {
  const category = props?.activeCategory;
  const parents = props?.parents ?? [];
  const onCancel = props?.onCancel ?? fakeFunction;
  const [properties, setProperties] = useState(emptyCategory?.baseProperties);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, formAction] = useActionState(addSubcategory, initialState);
  const [hasParent, setHasParent] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [parentOpen, setParentOpen] = useState(false);

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
          <CardHeader>
            <CardTitle>
              Create Subcategory for
              <h3 className="text-gray-600 font-semibold text-lg ">
                {" "}
                {category?.name}
              </h3>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <input type="hidden" name="catId" value={category?.id} />

            {/* Basic Info */}
            <GeneralInfo state={state} />

            {/* parent Info */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Category</label>
              <div className="flex items-center gap-4">
                {/* Have Parent Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hasParent}
                    onCheckedChange={(checked) => {
                      setHasParent(checked);
                      if (!checked) setParentId(null);
                    }}
                  />
                  <span className="text-sm">Have parent</span>
                </div>

                {/* Combobox (shown only if switch is ON) */}
                {hasParent && (
                  <Popover open={parentOpen} onOpenChange={setParentOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-50 justify-between"
                        name="parentName"
                      >
                        {parentId
                          ? parents.find((c) => c.id === parentId)?.name
                          : "Select parent"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-50 p-0">
                      <Command>
                        <CommandEmpty className="h-4 mb-1">
                          No category found.
                        </CommandEmpty>
                        <CommandGroup>
                          {parents.map((cat) => (
                            <CommandItem
                              key={cat.id}
                              defaultValue={cat.name}
                              onSelect={() => {
                                setParentId(cat.id);
                                setParentOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  parentId === cat.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {cat.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
                <input
                  type="hidden"
                  name="parent"
                  value={parentId ? parentId : ""}
                />
              </div>
            </div>

            {/* Properties */}
            <GeneralCat_SubcatProps
              errors={state?.errors?.properties}
              properties_={[]}
            />
            <Button type="submit" className="w-full">
              Create SubCategory
            </Button>
          </CardContent>

          {/* General message */}
          {state?.message && (
            <div className="justify-center mx-auto">
              {state.message === "Validation failed" ? (
                <p className="mt-2 text-sm text-destructive">{state.message}</p>
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
