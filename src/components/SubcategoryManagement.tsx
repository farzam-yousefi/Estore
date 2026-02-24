"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PropertyComponent from "@/components/PropertyComponent";
import { SuccessDialog } from "./CustomAlertDialog";
import { CategoryProperty } from "@/types/db/dbtypes";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  CategoryClient,
  CategoryPropertyForm,
  SubCategoryClient,
} from "@/types/dto/clientTypes";
import {
  getSubcats,
  State,
  updateSubCategoryProperties,
} from "@/lib/actions/category";
import CreateSubcategoryForm from "./CreateSubcategoryForm";

type Props = {
  category: CategoryClient;
  subCats: SubCategoryClient[];
};

const initialState: State = {
  message: "",
  errors: undefined,
  defaultValues: undefined,
};

function dbToFormProperty(prop: CategoryProperty): CategoryPropertyForm {
  return {
    id: prop._id?.toString(),
    name: prop.name,
    label: prop.label,
    type: prop.type,
    required: prop.required,
    options: prop.options ?? "",
    readOnly: true,
    insertInSub: false,
  };
}

export default function SubcategoryManagementPage({
  category,
  subCats,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const cancel = () => setOpen(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const openDrawer = (mode: "add" | "edit", sub?: SubCategoryClient) => {
    setActiveSub(sub ?? null);
    setExtraProperties(sub?.extraProperties ?? []);
    setOpen(true);
  };

  /* -------------------------------- */
  /* SUBCATEGORY SELECTION STATE      */
  /* -------------------------------- */
  const [subcats, setSubcats] = useState<SubCategoryClient[]>(subCats);
  const [selectedLevel1Id, setSelectedLevel1Id] = useState<string | null>(null);
  const [selectedLevel2Id, setSelectedLevel2Id] = useState<string | null>(null);
  const [selectedLevel1Value, setSelectedLevel1Value] = useState<string>("");
  const [selectedLevel2Value, setSelectedLevel2Value] = useState<string>("");
  const [activeSub, setActiveSub] = useState<SubCategoryClient | null>(null);

  const refreshSubcats = async () => {
    const data = await getSubcats(category.id);
    setSubcats(data);
  };

  /* -------------------------------- */
  /* PROPERTY STATE                   */
  /* -------------------------------- */
  const [level1Properties, setLevel1Properties] = useState<
    CategoryPropertyForm[]
  >([]);
  const [level2Properties, setLevel2Properties] = useState<
    CategoryPropertyForm[]
  >([]);
  const [extraProperties, setExtraProperties] = useState<
    CategoryPropertyForm[]
  >([]);
  const [originalLevel1Properties, setOriginalLevel1Properties] = useState<
    CategoryPropertyForm[]
  >([]);
  const [originalLevel2Properties, setOriginalLevel2Properties] = useState<
    CategoryPropertyForm[]
  >([]);

  /* -------------------------------- */
  /* FILTER SUBCATS                   */
  /* -------------------------------- */
  const level1Subcats = useMemo(
    () => subcats.filter((s) => s.level === 2),
    [subcats],
  );

  const level2Subcats = useMemo(
    () =>
      subcats.filter((s) => s.level === 3 && s.parentId === selectedLevel1Id),
    [subcats, selectedLevel1Id],
  );

  /* -------------------------------- */
  /* LOAD PROPERTIES ON SELECTION     */
  /* -------------------------------- */
  // When Level1 changes
  useEffect(() => {
    if (!selectedLevel1Id) {
      setLevel1Properties([]);
      setOriginalLevel1Properties([]);
      setLevel2Properties([]);
      setSelectedLevel2Id(null);
      return;
    }
    const found = level1Subcats.find((s) => s.id === selectedLevel1Id);
    if (!found) return;

    const normalizedProperties1 = (found.extraProperties ?? []).map((p) => ({
      ...p,
      readOnly: true,
      insertInSub: false,
    }));

    setOriginalLevel1Properties(normalizedProperties1); // snapshot of DB
    setLevel1Properties(normalizedProperties1); // working copy

    // Only reset Level 2 if selectedLevel2Id does not belong to this Level 1
    if (!level2Subcats.some((s) => s.id === selectedLevel2Id)) {
      setLevel2Properties([]);
      setSelectedLevel2Id(null);
    }
  }, [selectedLevel1Id]);

  // When Level2 changes
  useEffect(() => {
    if (!selectedLevel2Id) {
      setLevel2Properties([]);
      setOriginalLevel2Properties([]);
      return;
    }

    const found = level2Subcats.find((s) => s.id === selectedLevel2Id);
    if (!found) return;
    const normalizedProperties = (found.extraProperties ?? []).map((p) => ({
      ...p,
      readOnly: true,
      insertInSub: false,
    }));
    setOriginalLevel2Properties(normalizedProperties); // snapshot of DB
    setLevel2Properties(normalizedProperties); // working copy
  }, [selectedLevel2Id]);

  /* -------------------------------- */
  /* PROPERTY HANDLERS                */
  /* -------------------------------- */
  const [actionState, setActionState] = useState<State>(initialState);
  function handleAdd(level: 1 | 2) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;
    setActionState(initialState);
    setter((prev) => [
      ...prev,
      {
        name: "",
        label: "",
        type: "string",
        required: false,
        options: "",
        readOnly: false,
        insertInSub: true,
      },
    ]);
  }

  function handleInsertCheck(level: 1 | 2, index: number) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;
    setter((prev) =>
      prev.map((prop, i) => {
        if (i !== index) return prop;

        // Check if name and label are filled
        if (prop.name?.trim() && prop.label?.trim()) {
          // valid, allow insertion
          return { ...prop, readOnly: true, insertInSub: false };
        } else {
          // invalid, keep editable + optionally mark errors
          return {
            ...prop,
            errors: {
              name: !prop.name?.trim() ? "Name is required" : undefined,
              label: !prop.label?.trim() ? "Label is required" : undefined,
            },
          };
        }
      }),
    );
  }

  function handleEdit(level: 1 | 2, index: number) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;
    setter((prev) =>
      prev.map((prop, i) => {
        if (i !== index) return prop;
        return { ...prop, readOnly: false, insertInSub: true };
      }),
    );
  }

  function handlePropertyChange(
    level: 1 | 2,
    index: number,
    key: keyof CategoryPropertyForm,
    value: any,
  ) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;
    setter((prev) =>
      prev.map((prop, i) =>
        i === index
          ? {
              ...prop,
              [key]: value,
              errors: {
                ...prop.errors,
                [key]: undefined, // clear field error when editing
              },
            }
          : prop,
      ),
    );
  }

  async function handleRemove(level: 1 | 2, index: number) {
    const setter = level === 1 ? setLevel1Properties : setLevel2Properties;
    setter((prev) => prev.filter((_, i) => i !== index));
  }

  /* -------------------------------- */
  /*  SAVE  CANCEL                          */
  /* -------------------------------- */
  const [savingLevel, setSavingLevel] = useState<1 | 2 | null>(null);
  const hasPendingInsertLevel1 = level1Properties.some((p) => p.insertInSub);
  const canSaveLevel1 = level1Properties.length > 0 && !hasPendingInsertLevel1;
  const hasPendingInsertLevel2 = level2Properties.some((p) => p.insertInSub);
  const canSaveLevel2 = level2Properties.length > 0 && !hasPendingInsertLevel2;

  const [state, formAction] = useActionState(
    updateSubCategoryProperties,
    initialState,
  );

  //update state after susceesfull action
  useEffect(() => {
    if (state?.status === true && state?.data && savingLevel) {
      setShowSuccess(true);
      const converted = state.data.map(dbToFormProperty);

      if (savingLevel === 1) {
        setOriginalLevel1Properties(converted);
        setLevel1Properties(converted);
        setSubcats((prev) =>
          prev.map((subcat) =>
            subcat.id === selectedLevel1Id
              ? { ...subcat, extraProperties: converted }
              : subcat,
          ),
        );
      }

      if (savingLevel === 2) {
        setOriginalLevel2Properties(converted);
        setLevel2Properties(converted);
        setSubcats((prev) =>
          prev.map((subcat) =>
            subcat.id === selectedLevel2Id
              ? { ...subcat, extraProperties: converted }
              : subcat,
          ),
        );
      }
      setSavingLevel(null);
    }
  }, [state, savingLevel]);

  function handleCancel(level: 1 | 2) {
    if (level === 1) {
      setLevel1Properties(originalLevel1Properties);
      setSubcats((prev) =>
        prev.map((subcat) =>
          subcat.id === selectedLevel1Id
            ? { ...subcat, extraProperties: originalLevel1Properties }
            : subcat,
        ),
      );
    } else {
      setLevel2Properties(originalLevel2Properties);
      setSubcats((prev) =>
        prev.map((subcat) =>
          subcat.id === selectedLevel2Id
            ? { ...subcat, extraProperties: originalLevel2Properties }
            : subcat,
        ),
      );
    }
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
            type="button"
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
          type="button"
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
            <select
              className="w-full border rounded-md p-2"
              value={selectedLevel1Id || ""}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedLevel1Id(id);
                const selected = level1Subcats.find((s) => s.id === id);
                setSelectedLevel1Value(selected?.name || "");
                setSelectedLevel2Id(null);
                setSelectedLevel2Value("");
              }}
            >
              <option value="">Select Level 1</option>
              {level1Subcats.length == 0 ? (
                <option value="">There is No Subcat yet</option>
              ) : (
                level1Subcats.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Level 2 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Level 2 Subcategory</label>
            <select
              className="w-full border rounded-md p-2"
              value={selectedLevel2Id || ""}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedLevel2Id(id);
                const selected = level2Subcats.find((s) => s.id === id);
                setSelectedLevel2Value(selected?.name || "");
              }}
              disabled={!selectedLevel1Id} // Level 2 depends on Level 1
            >
              <option value="">Select Level 2</option>
              {level2Subcats.length == 0 ? (
                <option value="">There is No Subcat yet</option>
              ) : (
                level2Subcats.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAdd(1)}
                  disabled={!selectedLevel1Id}
                >
                  Add Property
                </Button>
              </span>
            </TooltipTrigger>
            {!selectedLevel1Id && (
              <TooltipContent>Select Level 1 first</TooltipContent>
            )}
          </Tooltip>
        </div>
        {level1Properties.length === 0 && (
          <p className="text-sm text-muted-foreground">
            There is no property yet.
          </p>
        )}

        <div className="space-y-4">
          {level1Properties.map((property, index) => {
            const propertyErrors =
              property.errors ?? state.errors?.properties?.[index];
            return (
              <PropertyComponent
                property={property}
                index={index}
                errors={propertyErrors}
                onChange={(i, k, v) => handlePropertyChange(1, i, k, v)}
                onRemove={(i) => {
                  handleRemove(1, i);
                }}
                onInsert={(i) => handleInsertCheck(1, i)}
                onEdit={(i) => handleEdit(1, i)}
              />
            );
          })}
        </div>

        <div className="flex justify-end gap- pt-4">
          <form
            action={(formData) => {
              setSavingLevel(1);
              formAction(formData);
            }}
          >
            <input type="hidden" name="categoryId" value={category.id} />
            <input
              type="hidden"
              name="subCategoryId"
              value={selectedLevel1Id ?? ""}
            />
            <input
              type="hidden"
              name="properties"
              value={JSON.stringify(level1Properties)}
            />
            {canSaveLevel1 && (
              <>
                <Button
                  className="mr-2"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleCancel(1);
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit">Save</Button>
              </>
            )}
          </form>
        </div>
      </Card>

      {/* LEVEL 2 CARD */}
      <Card className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold">Level 2 Properties</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAdd(2)}
                  disabled={!selectedLevel2Id}
                >
                  Add Property
                </Button>
              </span>
            </TooltipTrigger>
            {!selectedLevel1Id ? (
              <TooltipContent>Select Level 1 and then level2 </TooltipContent>
            ) : (
              !selectedLevel2Id && (
                <TooltipContent>Select level2 first </TooltipContent>
              )
            )}
          </Tooltip>
        </div>

        {level2Properties.length === 0 && (
          <p className="text-sm text-muted-foreground">
            There is no property yet.
          </p>
        )}

        <div className="space-y-4">
          {level2Properties.map((property, index) => {
            const propertyErrors =
              property.errors ?? state.errors?.properties?.[index];
            return (
              <PropertyComponent
                property={property}
                index={index}
                errors={propertyErrors}
                onChange={(i, k, v) => handlePropertyChange(2, i, k, v)}
                onRemove={(i) => {
                  handleRemove(2, i);
                }}
                onInsert={(i) => handleInsertCheck(2, i)}
                onEdit={(i) => handleEdit(2, i)}
              />
            );
          })}
        </div>

        <div className="flex justify-end gap- pt-4">
          <form
            action={(formData) => {
              setSavingLevel(2);
              formAction(formData);
            }}
          >
            <input type="hidden" name="categoryId" value={category.id} />
            <input
              type="hidden"
              name="subCategoryId"
              value={selectedLevel2Id ?? ""}
            />
            <input
              type="hidden"
              name="properties"
              value={JSON.stringify(level2Properties)}
            />
            {canSaveLevel2 && (
              <>
                <Button
                  className="mr-2"
                  type="button"
                  variant="outline"
                  onClick={() => handleCancel(2)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  // onClick={handleSaveLevel1}
                >
                  Save
                </Button>
              </>
            )}
          </form>
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
            {/* SCROLLABLE AREA */}
            <div className="p-0.5 space-y-4 overflow-y-auto h-[calc(100vh-6rem)]">
              <CreateSubcategoryForm
                props={{
                  activeCategory: category,
                  onCancel: cancel,
                  onSuccess: refreshSubcats,
                  parents: level1Subcats,
                }}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <SuccessDialog
        open={showSuccess}
        description={state?.message}
        onClose={() => {
          setShowSuccess(false);
        }}
      />
    </div>
  );
}
