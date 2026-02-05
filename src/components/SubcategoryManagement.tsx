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
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import PropertyComponent from "./PropertyComponent";
import { CategoryProperty, PropertyType } from "@/types/db/dbtypes";

type MasterCategory = {
  id: string;
  name: string;
  baseProperties: CategoryProperty[];
};

type SubCategory = {
  id: string;
  name: string;
  parentId: string | null;
  properties: CategoryProperty[]; // for level 1
  extraProperties?: CategoryProperty[]; // for level 2
};

const mockMasterCategory: MasterCategory = {
  id: "m1",
  name: "Electronics",
  baseProperties: [
    { name: "brand", label: "Brand", type: "string", required: true },
    { name: "warranty", label: "Warranty", type: "number", required: false },
  ],
};

const mockLevel1: SubCategory[] = [
  {
    id: "l1-1",
    name: "Phones",
    parentId: null,
    properties: [
      { name: "battery", label: "Battery", type: "number", required: true },
      { name: "screen", label: "Screen Size", type: "string", required: true },
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

const mockLevel2: SubCategory[] = [
  {
    id: "l2-1",
    name: "Smartphones",
    parentId: "l1-1",
    properties: [], // not used
    extraProperties: [
      { name: "camera", label: "Camera", type: "number", required: false },
    ],
  },
  {
    id: "l2-2",
    name: "Feature Phones",
    parentId: "l1-1",
    properties: [],
    extraProperties: [
      { name: "dualSim", label: "Dual SIM", type: "boolean", required: true },
    ],
  },
];

export default function SubcategoryManagementPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const router = useRouter();
  const categoryId = params.categoryId;

  const [level1, setLevel1] = useState<SubCategory[]>([]);
  const [level2, setLevel2] = useState<SubCategory[]>([]);
  const [selectedLevel1, setSelectedLevel1] = useState<string | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");

  const [activeSub, setActiveSub] = useState<SubCategory | null>(null);
  const [extraProperties, setExtraProperties] = useState<CategoryProperty[]>(
    [],
  );

  const [selectedLevel1Id, setSelectedLevel1Id] = useState<string | null>(null);
  const [selectedLevel2Id, setSelectedLevel2Id] = useState<string | null>(null);
  const [level1Value, setLevel1Value] = useState("");
  const [level2Value, setLevel2Value] = useState("");

  const [hasParent, setHasParent] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [parentOpen, setParentOpen] = useState(false);

  // Fetch mock data
  useEffect(() => {
    setLevel1(mockLevel1);
    setLevel2(mockLevel2);
  }, [categoryId]);

  // When level1 changes, clear level2
  useEffect(() => {
    setSelectedLevel2(null);
  }, [selectedLevel1]);

  const filteredLevel2 = level2.filter(
    (item) => item.parentId === selectedLevel1,
  );

  // ----------------------------
  // BASE PROPERTIES (correct)
  // ----------------------------
  //   const extraProperties = useMemo(() => {
  //     const level1Item = level1.find((x) => x.id === selectedLevel1);
  //     const level1Props = level1Item?.properties ?? [];

  //     // Combine master + level1
  //     return [...mockMasterCategory.baseProperties, ...level1Props];
  //   }, [level1, selectedLevel1]);

  const selectedLevel2Item = useMemo(() => {
    return level2.find((x) => x.id === selectedLevel2) ?? null;
  }, [level2, selectedLevel2]);

  const openDrawer = (mode: "add" | "edit", sub?: SubCategory) => {
    setDrawerMode(mode);
    setActiveSub(sub ?? null);
    setExtraProperties(sub?.extraProperties ?? []);
    setDrawerOpen(true);
  };

  const [properties, setProperties] = useState<CategoryProperty[]>([]);

  const addDrawerProperty = () => {
    setProperties([
      ...properties,
      { name: "", label: "", type: "string", required: false, options: [] },
    ]);
  };
  const updateDrawerProperty = <K extends keyof CategoryProperty>(
    index: number,
    key: K,
    value: CategoryProperty[K],
  ) => {
    setProperties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    );
  };

  const removeDrawerProperty = (index: number) => {
    setProperties((prev) => prev.filter((_, i) => i !== index));
  };

  const addProperty = () => {
    setExtraProperties((prev) => [
      ...prev,
      { name: "", label: "", type: "string", required: false },
    ]);
  };

  const updateProperty = (
    index: number,
    key: keyof CategoryProperty,
    value: any,
  ) => {
    setExtraProperties((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    );
  };

  const removeProperty = (index: number) => {
    setExtraProperties((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/categories")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Subcategories of </h1>
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
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Level 1 Subcategory</label>
            <Select
              value={selectedLevel1 ?? ""}
              onValueChange={(value) => setSelectedLevel1(value || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level 1 subcategory" />
              </SelectTrigger>
              <SelectContent>
                {level1.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Level 1 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Level 1 Subcategory</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {level1Value || "Type or select level 1"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type level 1 name..."
                    value={level1Value}
                    onValueChange={setLevel1Value}
                  />

                  <CommandGroup>
                    {level1.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          setLevel1Value(item.name);
                          setSelectedLevel1Id(item.id);
                          setLevel2Value("");
                          setSelectedLevel2Id(null);
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
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Level 2 Subcategory</label>
            <Select
              value={selectedLevel2 ?? ""}
              onValueChange={(value) => setSelectedLevel2(value || null)}
              disabled={!selectedLevel1}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedLevel1 ? "Select level 1 first" : "Select level 2"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredLevel2.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
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
                  {level2Value ||
                    (selectedLevel1Id
                      ? "Type or select level 2"
                      : "Select level 1 first")}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Type level 2 name..."
                    value={level2Value}
                    onValueChange={setLevel2Value}
                  />

                  <CommandGroup>
                    {filteredLevel2.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          setLevel2Value(item.name);
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

      {/* Properties Section */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Properties</h2>
            <Button variant="outline" onClick={addProperty}>
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          </div>

          {/* Base properties */}
          <div>
            <p className="text-xs font-semibold mb-2">
              Base Properties (Master Category)
            </p>
            <Card className="p-3 space-y-2">
              {mockMasterCategory.baseProperties.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Select Level 1 to see base properties.
                </p>
              ) : (
                mockMasterCategory.baseProperties.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{p.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {p.type}
                    </span>
                  </div>
                ))
              )}
            </Card>
          </div>
          {/* level1 properties (editable) */}
          <div>
            <p className="text-xs font-semibold mb-2">Level1 Properties</p>
            <Card className="p-3 space-y-3">
              {mockLevel1.map((item) =>
                item.properties.map((prop, idx) => (
                  // mockLevel1.map((prop, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <Input
                      className="col-span-4"
                      value={prop.name}
                      placeholder="Name"
                      onChange={(e) =>
                        updateProperty(idx, "name", e.target.value)
                      }
                    />
                    <Input
                      className="col-span-4"
                      value={prop.label}
                      placeholder="Label"
                      onChange={(e) =>
                        updateProperty(idx, "label", e.target.value)
                      }
                    />

                    <Select
                      value={prop.type}
                      onValueChange={(val) =>
                        updateProperty(idx, "type", val as PropertyType)
                      }
                    >
                      <SelectTrigger className="w-full col-span-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="number">number</SelectItem>
                        <SelectItem value="boolean">boolean</SelectItem>
                        <SelectItem value="date">date</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="col-span-2"
                      onClick={() => removeProperty(idx)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )),
              )}
            </Card>
          </div>
          {/* Extra properties (editable) */}
          <div>
            <p className="text-xs font-semibold mb-2">Level2 Properties</p>
            <Card className="p-3 space-y-3">
              {extraProperties.map((prop, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-4"
                    value={prop.name}
                    placeholder="Name"
                    onChange={(e) =>
                      updateProperty(idx, "name", e.target.value)
                    }
                  />
                  <Input
                    className="col-span-4"
                    value={prop.label}
                    placeholder="Label"
                    onChange={(e) =>
                      updateProperty(idx, "label", e.target.value)
                    }
                  />

                  <Select
                    value={prop.type}
                    onValueChange={(val) =>
                      updateProperty(idx, "type", val as PropertyType)
                    }
                  >
                    <SelectTrigger className="w-full col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="date">date</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="col-span-2"
                    onClick={() => removeProperty(idx)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </Card>
          </div>
          <div className="flex justify-end gap-2 pt-4 w-full">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={() => {
                const payload = {
                  level1: {
                    id: selectedLevel1Id,
                    name: level1Value,
                  },
                  level2: {
                    id: selectedLevel2Id,
                    name: level2Value,
                  },
                };

                console.log("SUBMIT:", payload);
                // call server action / mutation here
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Drawer (Add / Edit) */}

      <div className="@container/container space-y-4">
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          direction="right"
        >
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
            <DrawerHeader>
              <DrawerTitle>
                {drawerMode === "add" ? "Add Subcategory" : "Edit Subcategory"}
              </DrawerTitle>
            </DrawerHeader>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-6rem)]">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g. Smartphones" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Slug</label>
                <Input placeholder="e.g. smartphones" />
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
                        >
                          {parentId
                            ? mockLevel1.find((c) => c.id === parentId)?.name
                            : "Select parent"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-50 p-0">
                        <Command>
                          <CommandEmpty>No category found.</CommandEmpty>
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
                  <h3 className="text-lg font-semibold">Properties</h3>
                  <Button type="button" onClick={addDrawerProperty} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Property
                  </Button>
                </div>

                {properties.map((prop, index) => (
                  <div key={prop.label}>
                    <PropertyComponent
                      property={prop}
                      index={index}
                      onChange={updateDrawerProperty}
                      onRemove={removeDrawerProperty}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>
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
