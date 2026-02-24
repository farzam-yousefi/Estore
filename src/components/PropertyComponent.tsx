"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Save, Check } from "lucide-react";
import { CategoryPropertyForm } from "@/types/dto/clientTypes";
import { ConfirmDialog } from "./CustomAlertDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function FieldError({ message }: { message?: string }) {
  return <p className="text-sm text-destructive min-h-5">{message || ""}</p>;
}

export default function PropertyComponent({
  modal,
  property,
  index,
  errors,
  onChange,
  onRemove,
  onInsert,
  onEdit,
}: {
  modal?: boolean;
  insert?: boolean;
  property: CategoryPropertyForm;
  index: number;
  errors?: {
    name?: string;
    label?: string;
    type?: string;
  };
  onChange: (
    index: number,
    key: keyof CategoryPropertyForm,
    value: any,
  ) => void;
  onRemove: (index: number) => void;
  onInsert: (index: number) => void;
  onEdit: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const readOnly = modal ? false : (property.readOnly ?? false);
  function handleDeleteClick() {
    setOpenConfirm(true);
  }

  async function handleConfirmDelete(index: number) {
    onRemove(index);
    setOpenConfirm(false);
  }
  return (
    <>
      <div
        className={`border rounded-xl p-4 justify-evenly "md:flex md:flex-col md:gap-4"`}
      >
        {/* NAME + LABEL + REQUIRED (same row on md if readonly) */}
        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end md:gap-6`}
        >
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name={`properties[${index}].name`}
              value={property.name}
              disabled={readOnly}
              onChange={(e) => onChange(index, "name", e.target.value)}
              className="h-10"
            />
            <FieldError message={errors?.name} />
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              name={`properties[${index}].label`}
              value={property.label}
              disabled={readOnly}
              onChange={(e) => onChange(index, "label", e.target.value)}
              className="h-10"
            />
            <FieldError message={errors?.label} />
          </div>

          {/* Required */}
          <div className="flex items-center gap-2 h-19">
            <Switch
              name={`properties[${index}].required`}
              checked={property.required}
              disabled={readOnly}
              onCheckedChange={(v) => onChange(index, "required", v)}
            />
            <Label>Required</Label>
          </div>
        </div>

        {/* TYPE + OPTIONS (same row on md if readonly) */}
        <div
          className={`md:grid-cols-2 md:items-baseline justify-center md:gap-6
    ${
      modal
        ? "flex flex-row  items-baseline justify-around gap-4"
        : "grid grid-cols-1 gap-4"
    }`}
        >
          {/* Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              name={`properties[${index}].type`}
              value={property.type}
              disabled={readOnly}
              onValueChange={(v) => onChange(index, "type", v)}
            >
              <SelectTrigger className="h-10">
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

          {/* Options */}
          {property.type === "string" && (
            <div className="space-y-2">
              <Label>Options</Label>
              <Input
                name={`properties[${index}].options`}
                value={property.options || ""}
                disabled={readOnly}
                onChange={(e) => onChange(index, "options", e.target.value)}
                className="h-10"
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          {!modal && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick()}
              // onClick={() => onRemove(index)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
          <ConfirmDialog
            open={openConfirm}
            title="Delete Property"
            description="Are you sure to delete this Property?!"
            onConfirm={() => handleConfirmDelete(index)}
            onCancel={() => setOpenConfirm(false)}
          />
          {readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={() => onEdit(index)}
            >
              <Pencil className="w-4 h-4 text-blue-500" />
            </Button>
          )}
          {property.insertInSub && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onInsert(index)}
            >
              <Check className="w-4 h-4 text-blue-800" />
            </Button>
          )}
        </div>
      </div>

      {/* MODAL FOR EDIT   //extra */}
      {readOnly && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
            </DialogHeader>
            <PropertyComponent
              modal={true}
              property={property}
              index={index}
              errors={errors}
              onChange={onChange}
              onRemove={onRemove}
              onInsert={() => {}}
              onEdit={() => {}}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
