"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { FolderTree, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { CategoryClient } from "@/types/dto/clientTypes";
import { CategoryProperty } from "@/types/db/dbtypes";
import PropertyComponent from "./PropertyComponent";


// --- Mock Types ---
type CategoryRow = {
  categoryFeatures : CategoryClient,
  propsCount: number;
};

const mockCategories: CategoryRow[] = [
  { categoryFeatures:{_id:"1", name:"Electronic" ,slug:"electronic",baseProperties:[
    {name:"size" , label:"Size", type:"string", required:true , options:["S","M","L","XL"]}
  ,{name:"size2" , label:"Size2", type:"string", required:false , options:["S","M","L"]}
]}, propsCount: 3  },
  { categoryFeatures:{_id:"2" ,name:"Electronic2" ,slug:"electronic2",baseProperties:[
    {name:"size2" , label:"Size2", type:"string", required:false , options:["S","M","L"]}]}, propsCount: 5  },
];

// NOTE: Clicking "Manage Subcategories" should navigate to:
// /admin/categories/[categoryId]/subcategories

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryRow | null>(null);
  const [properties, setProperties] = useState<CategoryProperty[]>([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
const updateProperty = (
  index: number,
  key: keyof CategoryProperty,
  value: any
) => {
  setProperties((prev) =>
    prev.map((p, i) =>
      i === index ? { ...p, [key]: value } : p
    )
  );
};

const removeProperty = (index: number) => {
  setProperties((prev) => prev.filter((_, i) => i !== index));
};

   const addProperty = () => {
        setProperties([
          ...properties,
          { name: "", label: "", type: "string", required: false, options: [] },
        ]);
      };
    const openDrawer = (category?: CategoryRow) => {
  setActiveCategory(category ?? null);
  setProperties(category?.categoryFeatures.baseProperties ?? []);
  setOpen(true);
};

  // const openDrawer = (category?: CategoryRow) => {
  //   setActiveCategory(category ?? null);
  //   setOpen(true);
  // };

  return (
    <div className="p-4 md:p-6 space-y-6">
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
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCategories.map((cat) => (
              <tr key={cat.categoryFeatures._id} className="border-b last:border-none">
                <td className="px-3 py-2 font-medium">{cat.categoryFeatures.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{cat.categoryFeatures.slug}</td>
                <td className="px-3 py-2">{cat.propsCount}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/categories/${cat.categoryFeatures._id}/subcategory`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Manage Subcategories">
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
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Drawer */}
<div className="@container/container space-y-4">
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent className="
    w-full
    max-w-md
    ml-auto
    h-full
    @container
  ">
          <DrawerHeader>
            <DrawerTitle>
              {activeCategory ? "Edit Category" : "Add Category"}
            </DrawerTitle>
          </DrawerHeader>

            {/* SCROLLABLE AREA */}
    <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-6rem)]">
      <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={activeCategory?.categoryFeatures.name ?? ""} 
                          onChange={(e) => setName(e.target.value)} />
 
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Slug</label>
              <Input defaultValue={activeCategory?.categoryFeatures.slug ?? ""}
               onChange={(e) => setSlug(e.target.value)} />
            </div>

            <div className="space-y-2">
  <label className="text-sm font-medium">Properties</label>
  {/* <p className="text-xs text-muted-foreground">
    Base properties are inherited from parent. You can add or edit extra properties here.
  </p> */}

<div className="space-y-3">
    {/* Inherited (read-only)
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">Inherited</p>
      <Card className="p-3 text-sm text-muted-foreground">
        Size, Brand
      </Card>
    </div> */}
 {properties.map((prop, index) => (
  <PropertyComponent
    key={index}
    property={prop}
    index={index}
    onChange={updateProperty}
    onRemove={removeProperty}
  />
))}

    {/* Editable Extra Properties */}
    <div className="space-y-2">
      {/* <p className="text-xs font-semibold">Extra Properties</p> */}

      {/* <Card className="p-3 space-y-2">
        <Input placeholder="Property name (e.g. color)" />
        <Input placeholder="Type (string, number, boolean)" />
        <Input placeholder="Options (comma-separated, optional)" />
      </Card> */}

      <Button variant="outline" size="sm" onClick={addProperty}>
        <Plus className="mr-1 h-3 w-3" /> Add Property
      </Button>
    </div>
  </div>
</div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      </div>
    </div>
  );
}
