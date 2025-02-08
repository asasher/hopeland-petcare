"use client";

import { useState } from "react";
import { z } from "zod";
import { BaseForm } from "@/components/ui/form/base-form";
import {
  FormInputField,
  FormTextAreaField,
  FormSelectField,
} from "@/components/ui/form/form-field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import type {
  InventoryAdjustment,
  AdjustmentReason,
} from "@/lib/types/inventory";
import { inventoryStore, inventoryActions } from "@/lib/state/inventory";
import { useObservable } from "@legendapp/state/react";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const adjustmentItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number(),
  unitCost: z.number().min(0),
  totalCost: z.number().min(0),
  notes: z.string().optional(),
});

const adjustmentSchema = z.object({
  locationId: z.string().min(1, "Location is required"),
  reason: z.enum([
    "damage",
    "loss",
    "theft",
    "expiry",
    "correction",
    "other",
  ]) satisfies z.ZodType<AdjustmentReason>,
  description: z.string().min(1, "Description is required"),
  items: z.array(adjustmentItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

const defaultFormValues: AdjustmentFormValues = {
  locationId: "",
  reason: "correction",
  description: "",
  items: [
    {
      productId: "",
      variantId: "",
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      notes: "",
    },
  ],
  notes: "",
};

const reasonOptions: Array<{ label: string; value: AdjustmentReason }> = [
  { label: "Damage", value: "damage" },
  { label: "Loss", value: "loss" },
  { label: "Theft", value: "theft" },
  { label: "Expiry", value: "expiry" },
  { label: "Correction", value: "correction" },
  { label: "Other", value: "other" },
];

interface AdjustmentFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: InventoryAdjustment;
}

export function AdjustmentForm({
  open,
  onClose,
  initialData,
}: AdjustmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locations = useObservable(inventoryStore.locations);
  const locationList = Object.values(locations.get() ?? {});
  const locationOptions = locationList.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  const products = useObservable(inventoryStore.items);
  const productList = Object.values(products.get() ?? {});
  const productOptions = productList.map((product) => ({
    label: `${product.code} - ${product.name}`,
    value: product.id,
  }));

  const handleSubmit = async (data: AdjustmentFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        inventoryActions.updateAdjustment(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        inventoryActions.addAdjustment({
          id: crypto.randomUUID(),
          adjustmentNumber: `ADJ-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "draft",
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving adjustment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Adjustment" : "Create Adjustment"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={adjustmentSchema}
            onSubmit={handleSubmit}
            defaultValues={initialData ?? defaultFormValues}
            isSubmitting={isSubmitting}
          >
            {(form) => (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormSelectField
                      name="locationId"
                      label="Location"
                      options={locationOptions}
                      required
                    />
                    <FormSelectField
                      name="reason"
                      label="Reason"
                      options={reasonOptions}
                      required
                    />
                    <FormTextAreaField
                      name="description"
                      label="Description"
                      placeholder="Enter adjustment description"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Additional Details</h3>
                    {initialData?.status === "posted" && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Posted At</div>
                        <div className="text-sm text-muted-foreground">
                          {initialData.postedAt}
                        </div>
                        <div className="text-sm font-medium">Posted By</div>
                        <div className="text-sm text-muted-foreground">
                          {initialData.postedBy}
                        </div>
                      </div>
                    )}
                    <FormTextAreaField
                      name="notes"
                      label="Notes"
                      placeholder="Enter any additional notes"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Adjustment Items</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const items = form.getValues("items") || [];
                        form.setValue("items", [
                          ...items,
                          {
                            productId: "",
                            variantId: "",
                            quantity: 0,
                            unitCost: 0,
                            totalCost: 0,
                            notes: "",
                          },
                        ]);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {form.watch("items")?.map((_, index) => (
                      <div key={index} className="grid grid-cols-6 gap-4">
                        <div className="col-span-2">
                          <FormSelectField
                            name={`items.${index}.productId`}
                            label="Product"
                            options={productOptions}
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormInputField
                            name={`items.${index}.quantity`}
                            label="Quantity"
                            type="number"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormInputField
                            name={`items.${index}.unitCost`}
                            label="Unit Cost"
                            type="number"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormInputField
                            name={`items.${index}.totalCost`}
                            label="Total Cost"
                            type="number"
                            required
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const items = form.getValues("items");
                              form.setValue(
                                "items",
                                items.filter((_, i) => i !== index),
                              );
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
