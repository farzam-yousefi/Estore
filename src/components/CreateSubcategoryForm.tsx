"use client";
import { Switch } from "@/components/ui/switch";
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
import { Check, ChevronsUpDown, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActionState, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Label } from "@/components/ui/label";

import { CategoryProperty} from "@/types/db/dbtypes";
import {
  State,
  addSubcategory,
} from "@/lib/actions/category";
import PropertyComponent from "./PropertyComponent";
import Image from "next/image";
import { CategoryClient } from "@/types/dto/clientTypes";
import { emptyCategory } from "./CreateEditCategoryForm";

export const fakeCancel = () => {};

type CategoryDrawerProps = {
  activeCategory?: CategoryClient; // optional
  onCancel?: () => void; //optional
  onSuccess?: () => void; //optional
};

export default function CreateSubCategoryForm({
  props,
}: {
  props?: CategoryDrawerProps;
}) {
 
  const category = props?.activeCategory;
  const onCancel = props?.onCancel ?? fakeCancel;
  const [name, setName] = useState(category?.name);
  const [slug, setSlug] = useState(category?.slug);
  const [properties, setProperties] = useState(emptyCategory?.baseProperties);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image || null,
  );
  type SubCategory = {
    id: string;
    name: string;
    parentId: string | null;
    properties: CategoryProperty[]; // for level 1
    extraProperties?: CategoryProperty[]; // for level 2
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const mockLevel1: SubCategory[] = [
    {
      id: "l1-1",
      name: "Phones",
      parentId: null,
      properties: [
        { name: "battery", label: "Battery", type: "number", required: true },
        {
          name: "screen",
          label: "Screen Size",
          type: "string",
          required: true,
        },
      ],
    },
    {
      id: "l1-2",
      name: "Laptops",
      parentId: null,
      properties: [
        { name: "ram", label: "RAM (GB)", type: "number", required: true },
        { name: "cpu", label: "CPU", type: "string", required: true },
      ],
    },
  ];
  // Add a new empty property
  const addProperty = () => {
    setProperties((prev) => [
      ...prev,
      { name: "", label: "", type: "string", required: false, options: [] },
    ]);
  };

  // Update property field
  const updateProperty = (
    index: number,
    key: keyof CategoryProperty,
    value: any,
  ) => {
    setProperties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    );
  };

  // Remove property
  const removeProperty = (index: number) => {
    setProperties((prev) => prev.filter((_, i) => i !== index));
  };

  const initialState: State = {
    message: "",
    errors: undefined,
    defaultValues: undefined,
  };

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
      setProperties(state.defaultValues.properties || []);
    }
  }, [state?.defaultValues]);

  const propertyErrors = state?.errors?.properties ?? [];
  useEffect(() => {
    if (state?.message === "SubCategory was added successfully") {
      setShowSuccess(true);
    }
  }, [state?.message]);

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };
  return (
    <>
      <form action={formAction}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{`Create Subcategory for  ${category?.name} Category`}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="hidden" name="catId" value={category?._id} />
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="catName"
                  defaultValue={state?.defaultValues?.catName}
                  onChange={(e) => setName(e.target.value)}
                />
                {state?.errors?.name && (
                  <p className="text-sm text-destructive">
                    {state?.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  name="catSlug"
                  defaultValue={state?.defaultValues?.catSlug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                {state?.errors?.slug && (
                  <p className="text-sm text-destructive">
                    {state?.errors.slug}
                  </p>
                )}
              </div>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <Label>Image</Label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label
                  htmlFor="image"
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted transition"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Upload Image</span>
                </label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] ?? null)
                  }
                />

                <p className="text-xs text-blue-900">
                  PNG, JPG, WEBP — max 2MB
                </p>
                <input
                  type="hidden"
                  name="existingImage"
                  value={imagePreview ?? ""}
                />

                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {state?.errors?.image && (
                <p className="text-sm text-destructive">{state.errors.image}</p>
              )}
            </div>
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
                        variant="outline"
                        role="combobox"
                        className="w-50 justify-between"
                        name="parentName"
                      >
                        {parentId
                          ? mockLevel1.find((c) => c.id === parentId)?.name
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
                          {mockLevel1.map((cat) => (
                            <CommandItem
                              key={cat.id}
                              value={cat.name}
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
              </div>
            </div>
            {/* Properties */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Extra Properties</h3>
                <Button type="button" onClick={addProperty} size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Property
                </Button>
              </div>

              {properties.map((prop, index) => (
                <PropertyComponent
                  key={index}
                  property={prop}
                  index={index}
                  errors={propertyErrors[index]}
                  onChange={updateProperty}
                  onRemove={removeProperty}
                />
              ))}
            </div>

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

      <AlertDialog open={showSuccess}>
        <AlertDialogContent className="p-0 border-0 bg-transparent shadow-none fixed top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2">
          <div className="w-[320px] max-w-[90vw] rounded-xl bg-background p-6 shadow-xl">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle>Success 🎉</AlertDialogTitle>
              <AlertDialogDescription>{state?.message}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-4">
              <AlertDialogAction
                onClick={() => {
                  setShowSuccess(false);
                  onCancel(); // CLOSE DRAWER
                  props?.onSuccess?.(); // refresh list
                }}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
