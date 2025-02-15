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
} from "@/components/ui/dialog";
import type { AdjustmentReason } from "@/lib/types/inventory";
import { inventoryActions } from "@/lib/state/inventory";
import { productStore } from "@/lib/state/products";
import { useObservable } from "@legendapp/state/react";

const adjustmentSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  reason: z.enum(["damage", "correction", "other"] as const),
  notes: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

const reasonOptions = [
  { value: "damage", label: "Damage" },
  { value: "correction", label: "Correction" },
  { value: "other", label: "Other" },
];

interface AdjustmentFormProps {
  onClose: () => void;
}

export function AdjustmentForm({ onClose }: AdjustmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const products = useObservable(productStore.items);
  const productList = Object.values(products.get() ?? {});

  const handleSubmit = async (data: AdjustmentFormData) => {
    try {
      setIsSubmitting(true);
      const adjustment = {
        id: crypto.randomUUID(),
        productId: data.productId,
        quantity: data.quantity,
        reason: data.reason,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      inventoryActions.addAdjustment(adjustment);
      onClose();
    } catch (error) {
      console.error("Error saving adjustment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Inventory Adjustment</DialogTitle>
        </DialogHeader>

        <BaseForm
          schema={adjustmentSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            productId: "",
            quantity: 1,
            reason: "correction",
            notes: "",
          }}
          isSubmitting={isSubmitting}
        >
          {() => (
            <div className="space-y-4">
              <FormSelectField
                name="productId"
                label="Product"
                options={productList.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                required
              />

              <FormInputField
                name="quantity"
                label="Quantity"
                type="number"
                required
              />

              <FormSelectField
                name="reason"
                label="Reason"
                options={reasonOptions}
                required
              />

              <FormTextAreaField
                name="notes"
                label="Notes"
                placeholder="Add any notes about this adjustment"
              />
            </div>
          )}
        </BaseForm>
      </DialogContent>
    </Dialog>
  );
}
