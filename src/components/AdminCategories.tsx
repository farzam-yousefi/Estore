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
import { Eye, FolderTree, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { CategoryClient, CategoryPropertyForm } from "@/types/dto/clientTypes";
import Image from "next/image";
import { emptyCategory } from "./CreateEditCategoryForm";
import {
  deleteCat_subCat,
  getCategoriesWithCounts,
} from "@/lib/actions/category";
import CreateEditCategoryForm from "./CreateEditCategoryForm";
import { Badge } from "./ui/badge";
import { ConfirmDialog } from "./CustomAlertDialog";

export default function AdminCategoriesPage() {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<CategoryClient>(emptyCategory);
  const [properties, setProperties] = useState<CategoryPropertyForm[]>([]);
  const [categories, setCategories] = useState<CategoryClient[]>([]);

  const fetchCategories = async () => {
    const data = await getCategoriesWithCounts();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCat_subCat("categories", id);
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

  return (
    <div className="p-0.5 md:p-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Link href="/admin/categories/create">
          <Button type="button">
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
              <th className="px-3 py-2 text-left">Subcats</th>
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
                  <td className="px-3 py-2 items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="View"
                      className="relative"
                    >
                      <Eye className="h-6 w-6" />
                      {cat.subCount !== undefined && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 text-xs"
                        >
                          {cat.subCount}
                        </Badge>
                      )}
                    </Button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/categories/subcategories/${cat.id}`}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Manage Subcategories"
                        >
                          <FolderTree className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openDrawer(cat)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoryToDelete(cat.id)}
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
        <ConfirmDialog
          open={!!categoryToDelete}
          title="Delete Category"
          description="This will permanently remove this category and related data. Are you sure?"
          onConfirm={async () => {
            if (!categoryToDelete) return;
            await handleDelete(categoryToDelete);
            setCategoryToDelete(null);
          }}
          onCancel={() => setCategoryToDelete(null)}
        />
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
                  onSuccess: fetchCategories, 
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
