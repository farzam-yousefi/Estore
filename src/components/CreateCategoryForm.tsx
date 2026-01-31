"use client";

import { useActionState, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { CategoryProperty } from "@/types/db/dbtypes";
import { State, addCategory } from "@/lib/actions/category";
import PropertyComponent from "./PropertyComponent";


export default function CreateCategoryForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [properties, setProperties] = useState<CategoryProperty[]>([]);

  const addProperty = () => {
    setProperties([
      ...properties,
      { name: "", label: "", type: "string", required: false, options: [] },
    ]);
  };

  const updateProperty = (
    index: number,
    key: keyof CategoryProperty,
    value: any
  ) => {
    setProperties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p))
    );
  };

  const removeProperty = (index: number) => {
    setProperties((prev) => prev.filter((_, i) => i !== index));
  };

  const initialState: State = {
  message: "",
  errors: undefined,
  defaultValues: undefined,
};

  const [state, formAction] = useActionState(addCategory, initialState);
  const propertyErrors = state.errors?.properties ?? [];

  return (
    <form action={formAction}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create Master Category</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                name="catName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {state.errors?.name && (
                <p className="text-sm text-destructive">{state.errors?.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                name="catSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              {state.errors?.slug && (
                <p className="text-sm text-destructive">{state.errors?.slug}</p>
              )}
            </div>
          </div>

          {/* Properties */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Base Properties</h3>
              <Button type="button" onClick={addProperty} size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Property
              </Button>
            </div>

            {properties.map((prop, index) => (
              <PropertyComponent
                property={prop}
                key={index}
                index={index}
                errors={propertyErrors[index]}
                onChange={updateProperty}
                onRemove={removeProperty}
              />
            ))}
          </div>

          <Button type="submit" className="w-full">
            Create Category
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
