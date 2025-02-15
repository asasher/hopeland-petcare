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
import type { PurchaseOrder } from "@/lib/types/purchase";
import { purchaseActions } from "@/lib/state/purchases";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Ordered", value: "ordered" },
  { label: "Received", value: "received" },
  { label: "Cancelled", value: "cancelled" },
];

const purchaseOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  status: z.enum(["draft", "ordered", "received", "cancelled"] as const),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
      total: z.number().min(0),
      receivedQuantity: z.number().min(0).optional(),
    }),
  ),
  total: z.number().min(0),
  expectedDeliveryDate: z.string().optional(),
  receivedAt: z.string().optional(),
  notes: z.string().optional(),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

const defaultFormValues: PurchaseOrderFormValues = {
  orderNumber: "",
  vendorId: "",
  status: "draft",
  items: [],
  total: 0,
  notes: "",
};

interface PurchaseOrderFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: PurchaseOrder;
}

export function PurchaseOrderForm({
  open,
  onClose,
  initialData,
}: PurchaseOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PurchaseOrderFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        purchaseActions.updateOrder(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        purchaseActions.addOrder({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving purchase order:", error);
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
              {initialData ? "Edit Purchase Order" : "Create Purchase Order"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={purchaseOrderSchema}
            onSubmit={handleSubmit}
            defaultValues={initialData ?? defaultFormValues}
            isSubmitting={isSubmitting}
          >
            {() => (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormInputField
                    name="orderNumber"
                    label="Order Number"
                    placeholder="Enter order number"
                    required
                  />
                  <FormInputField
                    name="vendorId"
                    label="Vendor"
                    placeholder="Select vendor"
                    required
                  />
                  <FormSelectField
                    name="status"
                    label="Status"
                    options={statusOptions}
                    required
                  />
                  <FormInputField
                    name="total"
                    label="Total"
                    type="number"
                    required
                  />
                  <FormInputField
                    name="expectedDeliveryDate"
                    label="Expected Delivery Date"
                    type="text"
                  />
                </div>
                <div className="space-y-4">
                  {initialData?.status === "received" && (
                    <FormInputField
                      name="receivedAt"
                      label="Received At"
                      type="text"
                    />
                  )}
                  <FormTextAreaField
                    name="notes"
                    label="Notes"
                    placeholder="Add any notes about this order"
                  />
                </div>
              </div>
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
