"use client";

import { useActionState, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Plus } from "lucide-react";
import { CategoryProperty } from "@/types/db/dbtypes";
import { State, addCategory } from "@/lib/actions/category";
import PropertyComponent from "./PropertyComponent";
import Image from "next/image";
import Link from "next/link";

export default function CreateCategoryForm() {

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imagePreview,setImagePreview]= useState<string|null>(null);
  const [properties, setProperties] = useState<CategoryProperty[]>([]);

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
    value: any
  ) => {
    setProperties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p))
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

  const [state, formAction] = useActionState(addCategory, initialState);

  // Update form values when validation fails
  useEffect(() => {
    if (state.defaultValues) {
      setName(state.defaultValues.catName || "");
      setSlug(state.defaultValues.catSlug || "");
      setImagePreview(state.defaultValues.catImage|| "")
      setProperties(state.defaultValues.properties || []);
    }
  }, [state.defaultValues]);

  const propertyErrors = state.errors?.properties ?? [];

  const handleImageChange = (file :File | null) =>{
    if(!file) return;
    setImagePreview (URL.createObjectURL(file));
  }
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
                <p className="text-sm text-destructive">{state.errors.name}</p>
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
                <p className="text-sm text-destructive">{state.errors.slug}</p>
              )}
            </div>
          </div>




  {/* Category Image */}
          <div className="space-y-2">
            <Label>Category Image</Label>

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
             {state.errors?.image && (
                <p className="text-sm text-destructive">{state.errors.image}</p>
              )}
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
            Create Category
          </Button>

        

        </CardContent>
          {/* General message */}
          {state.message && (
            <div className="justify-center mx-auto">        
          {(state.message==="Category was added successfully") ? (
            <>
            <p className="mt-2 text-sm text-green-600">{state.message}</p>
            <Link href="/admin/categories"> <Button type="submit"  className="w-full mt-2">
            Show Categories
          </Button>
          </Link>
          </>
          )
          :(
            <p className="mt-2 text-sm text-destructive">{state.message}</p>
          )
        }
          </div>
        )}
      </Card>
      
    </form>

  );

}
