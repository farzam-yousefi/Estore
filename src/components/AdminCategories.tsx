"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { FolderTree, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { CategoryClient, CategoryPropertyForm } from "@/types/dto/clientTypes";
import { CategoryProperty } from "@/types/db/dbtypes";
import { selectCollectionDocs } from "@/lib/db";
import Image from "next/image";
import { emptyCategory } from "./CreateEditCategoryForm";
import { deleteCategory } from "@/lib/actions/category";
import CreateEditCategoryForm from "./CreateEditCategoryForm";

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CategoryClient>(emptyCategory);
  const [properties, setProperties] = useState<CategoryPropertyForm[]>([]);
  const [categories, setCategories] = useState<CategoryClient[]>([]);

  const fetchCategories = async () => {
    const data = await selectCollectionDocs<CategoryClient>("categories");
    setCategories(data ?? []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory("categories", id);
      // update state to remove the deleted category from UI
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const cancel = () => setOpen(false);
  const openDrawer = (category?: CategoryClient) => {
    setActiveCategory(category ?? emptyCategory);
    setProperties(category?.baseProperties ?? []);
    setOpen(true);
  };
  const normalizedCategory = useMemo(() => {
    if (!activeCategory?.id) return emptyCategory;

    return {
      ...activeCategory,
      image: activeCategory.image
        ? `/uploads/categories/${activeCategory.image}`
        : null,
    };
  }, [activeCategory]);
console.log("AAAAAAAAAAaa",categories)
  return (
    <div className="p-0.5 md:p-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Link href="/admin/categories/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Props</th>
              <th className="px-3 py-2 text-left">Image</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          {categories?.length !== 0 && (
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-none">
                  <td className="px-3 py-2 font-medium">{cat.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {cat.slug}
                  </td>
                  <td className="px-3 py-2 items-center">
                    {cat.baseProperties ? cat.baseProperties.length : 0}
                  </td>
                  <td className="px-3 py-2">
                    <div className="relative w-15 h-15 rounded-lg overflow-hidden border">
                      <Image
                        src={`/uploads/categories/${cat.image}`}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/categories/subcategories/${cat.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Manage Subcategories"
                        >
                          <FolderTree className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDrawer(cat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </Card>

      {/* Drawer */}
      <div className="@container/container space-y-4">
        <Drawer open={open} onOpenChange={setOpen} direction="right">
          <DrawerContent
            className="
    w-full
    max-w-md
    ml-auto
    h-full
    @container
  "
          >
            <DrawerHeader>
              <DrawerTitle>
                {activeCategory ? "Edit Category" : "Add Category"}
              </DrawerTitle>
            </DrawerHeader>

            {/* SCROLLABLE AREA */}
            <div className="p-0.5 space-y-4 overflow-y-auto h-[calc(100vh-6rem)]">
              <CreateEditCategoryForm
                props={{
                  activeCategory: normalizedCategory,
                  onCancel: cancel,
                  onSuccess: fetchCategories, // 👈 ADD THIS
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
