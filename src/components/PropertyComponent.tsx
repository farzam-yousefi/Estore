"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CategoryProperty } from "@/types/db/dbtypes";

function FieldError({ message }: { message?: string }) {
  return <p className="text-sm text-destructive min-h-5">{message || ""}</p>;
}
export default function PropertyComponent({
  property,
  index,
  errors,
  onChange,
  onRemove,
}: {
  property: CategoryProperty;
  index: number;
  errors?: {
    name?: string;
    label?: string;
    type?: string;
  };
  onChange: (index: number, key: keyof CategoryProperty, value: any) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 @lg:grid-cols-6 gap-3 items-end border rounded-xl p-4 space-y-2">
      <div className="space-y-2 md:col-span-1">
        <Label>Name</Label>
        <Input
          name={`properties[${index}].name`}
          value={property.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
        />
        <FieldError message={errors?.name} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Label</Label>
        <Input
          name={`properties[${index}].label`}
          value={property.label}
          onChange={(e) => onChange(index, "label", e.target.value)}
        />
        <FieldError message={errors?.label} />
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
          <FieldError message={errors?.type} />
        </div>
        {/* Required */}
        <div className="flex items-center gap-2 pb-1">
          <Switch
            name={`properties[${index}].required`}
            checked={property.required}
            onCheckedChange={(v) => onChange(index, "required", v)}
          />
          <Label>Required</Label>
        </div>
      </div>
      {/* Options for string type */}
      {property.type === "string" && (
        <div className="space-y-2 md:col-span-3">
          <Label>Options</Label>
          <div className="flex gap-x-2">
            <Input
              name={`properties[${index}].options`}
              value={property.options || ""}
              onChange={(e) => onChange(index, "options", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated values shown when creating products
            </p>
          </div>
        </div>
      )}
      <Button variant="ghost" size="icon" onClick={() => onRemove(index)}>
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
}
