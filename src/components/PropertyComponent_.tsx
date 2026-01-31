"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CategoryProperty } from "@/types/db/dbtypes";

export default function PropertyComponent({
  property,
  index,
  errors,
  onChange,
  onRemove,
}: {
  property: CategoryProperty;
  index: number;
  errors?: { name?: string; label?: string; type?: string };
 
  onChange: (
    index: number,
    key: keyof CategoryProperty,
    value: any
  ) => void;
  onRemove: (index: number) => void;
}) {
   
    //   const [properties, setProperties] = useState<CategoryProperty[]>([]);
    
    //   const addProperty = () => {
    //     setProperties([
    //       ...properties,
    //       { name: "", label: "", type: "string", required: false, options: [] },
    //     ]);
    //   };
    
    //   const updateProperty = (
    //     index: number,
    //     key: keyof CategoryProperty,
    //     value: any
    //   ) => {
    //     const updated = [...properties];
    //     (updated[index] as any)[key] = value;
    //     setProperties(updated);
    //   };
    
    //   const removeProperty = (index: number) => {
    //     setProperties(properties.filter((_, i) => i !== index));
    //   };
return (
      <div
  className="
    grid
    grid-cols-1
    @lg:grid-cols-6
    gap-3
    items-end
    border
    rounded-xl
    p-4
    space-y-2
  "

              key={index}
            //   className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end border rounded-xl p-4"
            >
<div className="space-y-2 md:col-span-1 @md:col-span-1">
                <Label>Name</Label>
               <Input name={`properties[${index}].name`} 
                  value={property.name}
                  onChange={(e) =>
                    onChange(index, "name", e.target.value)
                  }
                />
              </div>

<div className="space-y-2 md:col-span-2 @md:col-span-1">
                <Label>Label</Label>
                <Input name={`properties[${index}].label`} 
                  value={property.label}
                  onChange={(e) =>
                    onChange(index, "label", e.target.value)
                  }
                />
              </div>
<div className="col-span-full flex items-end gap-6">
  {/* Type */}
  <div className="space-y-2 flex-1">
    <Label>Type</Label>
    <Select
   name={`properties[${index}].type`}
      value={property.type}
      onValueChange={(v) => onChange(index, "type", v)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="string">String</SelectItem>
        <SelectItem value="number">Number</SelectItem>
        <SelectItem value="boolean">Boolean</SelectItem>
        <SelectItem value="date">Date</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Required */}
  <div className="flex items-center gap-2 pb-1">
    <Switch
   name={`properties[${index}].required`}

  // checked={!!state?.defaultValues?.requizit} 
    checked={property.required}
      onCheckedChange={(v) =>
        onChange(index, "required", v)
      }
    />
    <Label>Required</Label>
  </div>
</div>

              
              {/* Options for string type */}
              {property.type === "string" && (
<div className="space-y-2 md:col-span-3 @md:col-span-1">
                  <Label>Options</Label>
                  <div className="flex gap-x-2">
                    <Input
                    name={`properties[${index}].options`}
                      value={(property.options || []).join(",")}
                      onChange={(e) =>
                        onChange(
                          index,
                          "options",
                          e.target.value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated values shown when creating products
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
);

    }