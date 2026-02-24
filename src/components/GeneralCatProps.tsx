import { useState } from "react";
import {CategoryPropertyForm } from "@/types/dto/clientTypes";
import PropertyComponent from "./PropertyComponent";
import { Button } from "./ui/button";
import { fakeFunction } from "@/lib/generalUtilities";
import { Plus } from "lucide-react";

export default function GeneralCat_SubcatProps({
  properties_,
  errors,
}: {
  properties_: CategoryPropertyForm[];
  errors: any;
}) {
  const [properties, setProperties] = useState(properties_);
  const propertyErrors = errors ?? [];
  
  // Add a new empty property
  const addProperty = () => {
    setProperties((prev) => [
      ...prev,
      { name: "", label: "", type: "string", required: false, options: "" },
    ]);
  };

  // Update property field
  const updateProperty = (
    index: number,
    key: keyof CategoryPropertyForm,
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

  return (
    <>
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
            onInsert={fakeFunction}
            onEdit={fakeFunction}
          />
        ))}
      </div>
    </>
  );
}
