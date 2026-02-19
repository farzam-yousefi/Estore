"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyComponent from "@/components/PropertyComponent";
import {
  CategoryClient,
  CategoryPropertyForm,
  SubCategoryClient,
} from "@/types/dto/clientTypes";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import CreateSubcategoryForm from "./CreateSubcategoryForm";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type Props = {
  category: CategoryClient;
  subCats: SubCategoryClient[];
};

function normalizeOptionsToString(options: unknown): string {
  if (Array.isArray(options)) {
    return options.join(", ");
  }
  if (typeof options === "string") {
    return options;
  }
  return "";
}

export default function SubcategoryManagementPage({
  category,
  subCats,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const cancel = () => setOpen(false);

  const [activeSub, setActiveSub] = useState<SubCategoryClient | null>(null);
  const [extraProperties, setExtraProperties] = useState<
    CategoryPropertyForm[]
  >([]);
  const openDrawer = (mode: "add" | "edit", sub?: SubCategoryClient) => {
    setActiveSub(sub ?? null);
    setExtraProperties(sub?.extraProperties ?? []);
    setOpen(true);
  };

  /* -------------------------------- */
  /* SUBCATEGORY SELECTION STATE      */
  /* -------------------------------- */
  const [selectedLevel1Id, setSelectedLevel1Id] = useState<string | null>(null);
  const [selectedLevel2Id, setSelectedLevel2Id] = useState<string | null>(null);
  const [selectedLevel1Value, setSelectedLevel1Value] = useState<string>("");
  const [selectedLevel2Value, setSelectedLevel2Value] = useState<string>("");

  /* -------------------------------- */
  /* PROPERTY STATE                   */
  /* -------------------------------- */
  const [level1Properties, setLevel1Properties] = useState<
    CategoryPropertyForm[]
  >([]);
  const [level2Properties, setLevel2Properties] = useState<
    CategoryPropertyForm[]
  >([]);

  /* -------------------------------- */
  /* FILTER SUBCATS                   */
  /* -------------------------------- */
  const level1Subcats = useMemo(
    () => subCats.filter((s) => s.level === 2),
    [subCats],
  );

  const level2Subcats = useMemo(
    () =>
      subCats.filter((s) => s.level === 3 && s.parentId === selectedLevel1Id),
    [subCats, selectedLevel1Id],
  );

  /* -------------------------------- */
  /* LOAD PROPERTIES ON SELECTION     */
  /* -------------------------------- */
  // When Level1 changes
  useEffect(() => {
    if (!selectedLevel1Id) {
      setLevel1Properties([]);
      setLevel2Properties([]);
      setSelectedLevel2Id(null);
      return;
    }

    const selected = level1Subcats.find((s) => s.id === selectedLevel1Id);

    setLevel1Properties(
      (selected?.extraProperties ?? []).map((p) => ({
        ...p,
        options: normalizeOptionsToString(p.options),
      })),
    );
    setLevel2Properties([]);
    setSelectedLevel2Id(null);
  }, [selectedLevel1Id, level1Subcats]);

  // When Level2 changes
  useEffect(() => {
    if (!selectedLevel2Id) {
      setLevel2Properties([]);
      return;
    }

    const selected = level2Subcats.find((s) => s.id === selectedLevel2Id);

    setLevel2Properties(
      (selected?.extraProperties ?? []).map((p) => ({
        ...p,
        options: normalizeOptionsToString(p.options),
      })),
    );
  }, [selectedLevel2Id, level2Subcats]);

  /* -------------------------------- */
  /* PROPERTY HANDLERS                */
  /* -------------------------------- */
  function handlePropertyChange(
    level: 1 | 2,
    index: number,
    key: keyof CategoryPropertyForm,
    value: any,
  ) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;

    setter((prev) =>
      prev.map((prop, i) => (i === index ? { ...prop, [key]: value } : prop)),
    );
  }

  function handleRemove(level: 1 | 2, index: number) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;

    setter((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAdd(level: 1 | 2) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;

    setter((prev) => [
      ...prev,
      {
        name: "",
        label: "",
        type: "string",
        required: false,
        options: "",
      },
    ]);
  }

  /* -------------------------------- */
  /* RENDER                           */
  /* -------------------------------- */
  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/categories")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold ">Subcategories of </h2>
          <h3 className="text-gray-600 font-semibold text-lg ">
            {" "}
            &nbsp;&nbsp; {category?.name}{" "}
          </h3>
        </div>

        <Button
          onClick={() => {
            openDrawer("add");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Subcategory
        </Button>
      </div>

      {/* Two-column dropdown layout */}
      <Card className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Level 1 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Level 1 Subcategory</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedLevel1Value || "Type or select level 1"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type level 1 name..."
                    value={selectedLevel1Value}
                    onValueChange={setSelectedLevel1Value}
                  />
                  <CommandGroup>
                    {level1Subcats.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          setSelectedLevel1Value(item.name);
                          setSelectedLevel1Id(item.id);
                          setSelectedLevel2Value("");
                          setSelectedLevel2Id(null);
                          // fetchLevel2subCats(selectedLevel1Id);
                        }}
                      >
                        {item.name}
                        {selectedLevel1Id === item.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Level 2 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Level 2 Subcategory</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!selectedLevel1Id}
                >
                  {selectedLevel2Value ||
                    (selectedLevel1Id
                      ? "Type or select level 2"
                      : "Select level 1 first")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type level 2 name..."
                    value={selectedLevel2Value}
                    onValueChange={setSelectedLevel2Value}
                  />
                  <CommandGroup>
                    {level2Subcats.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          setSelectedLevel2Value(item.name);
                          setSelectedLevel2Id(item.id);
                        }}
                      >
                        {item.name}
                        {selectedLevel2Id === item.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* Base properties */}
      <div>
        <p className="text-xs font-semibold mb-2">
          Base Properties (Master Category)
        </p>
        <Card className="p-3 space-y-2">
          {category.baseProperties.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Select Level 1 to see base properties.
            </p>
          ) : (
            category.baseProperties.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <span>{p.label}</span>
                <span className="text-muted-foreground text-xs">{p.type}</span>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* LEVEL 1 CARD */}
      <Card className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">Level 1 Properties</h3>
          <Button variant="outline" onClick={() => handleAdd(1)}>
            Add Property
          </Button>
        </div>
        {level1Properties.length === 0 && (
          <p className="text-sm text-muted-foreground">
            There is no property yet.
          </p>
        )}

        <div className="space-y-4">
          {level1Properties.map((property, index) => (
            <PropertyComponent
              property={property}
              index={index}
              onChange={(i, k, v) => handlePropertyChange(1, i, k, v)}
              onRemove={(i) => handleRemove(1, i)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setLevel1Properties([])}>
            Cancel
          </Button>

          <Button
            onClick={() => {
              const formatted = level1Properties.map((p) => ({
                ...p,
                options: p.options
                  ? p.options
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  : [],
              }));
              console.log("SAVE LEVEL 1:", {
                categoryId: category.id,
                subCategoryId: selectedLevel1Id,
                properties: formatted,
              });
            }}
          >
            Save
          </Button>
        </div>
      </Card>

      {/* LEVEL 2 CARD */}
      <Card className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">Level 2 Properties</h3>
          <Button
            variant="outline"
            onClick={() => handleAdd(2)}
            disabled={!selectedLevel2Id}
          >
            Add Property
          </Button>
        </div>

        {level2Properties.length === 0 && (
          <p className="text-sm text-muted-foreground">
            There is no property yet.
          </p>
        )}

        <div className="space-y-4">
          {level2Properties.map((property, index) => (
            <PropertyComponent
              property={property}
              index={index}
              onChange={(i, k, v) => handlePropertyChange(2, i, k, v)}
              onRemove={(i) => handleRemove(2, i)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setLevel2Properties([])}>
            Cancel
          </Button>

          <Button
            onClick={() => {
              const formatted = level2Properties.map((p) => ({
                ...p,
                options: p.options
                  ? p.options
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  : [],
              }));
              console.log("SAVE LEVEL 2:", {
                categoryId: category.id,
                subCategoryId: selectedLevel2Id,
                properties: formatted,
              });
            }}
          >
            Save
          </Button>
        </div>
      </Card>

      {/* Drawer (Add / Edit) */}
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
            {/* <DrawerContent className="w-full max-w-md ml-auto"> */}
            {/* <DrawerHeader>
              <DrawerTitle>
                {drawerMode === "add" ? "Add Subcategory" : "Edit Subcategory"}
              </DrawerTitle>
            </DrawerHeader>
             */}
            {/* SCROLLABLE AREA */}

            <div className="p-0.5 space-y-4 overflow-y-auto h-[calc(100vh-6rem)]">
              <CreateSubcategoryForm
                props={{
                  activeCategory: category,
                  onCancel: cancel,
                  //   onSuccess: fetchCategories, // 👈 ADD THIS
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
