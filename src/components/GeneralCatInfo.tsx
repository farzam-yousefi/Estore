import { ImageIcon } from "lucide-react";
import { Label } from "recharts";
import { Input } from "./ui/input";
import Image from "next/image";
import { useState } from "react";
import { CategoryClient } from "@/types/dto/clientTypes";
import { State } from "@/lib/actions/category";
import { emptyCategory } from "./CreateEditCategoryForm";

export default function GeneralInfo({
  activeCategory,
  state,
}: {
  activeCategory?: CategoryClient;
  state: State | null;
}) {
  const category = activeCategory ?? emptyCategory;
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image || null,
  );

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };
  return (
    <>
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category Name</Label>
          <Input
            name="catName"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
          {state?.errors?.name && (
            <p className="text-sm text-destructive">{state?.errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            name="catSlug"
            defaultValue={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          {state?.errors?.slug && (
            <p className="text-sm text-destructive">{state?.errors.slug}</p>
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
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-blue-900">PNG, JPG, WEBP — max 2MB</p>
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
    </>
  );
}
