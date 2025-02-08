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
import type { PurchaseOrder, PurchaseOrderStatus } from "@/lib/types/purchase";
import { purchaseActions } from "@/lib/state/purchases";

const purchaseOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  status: z.enum([
    "draft",
    "submitted",
    "approved",
    "ordered",
    "partial",
    "received",
    "cancelled",
  ] as const),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      tax: z.number().min(0),
      total: z.number().min(0),
      receivedQuantity: z.number().min(0),
      notes: z.string().optional(),
    }),
  ),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
  expectedDeliveryDate: z.string().optional(),
  receivingDetails: z
    .object({
      receivedAt: z.string(),
      receivedBy: z.string(),
      locationId: z.string(),
      notes: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

const defaultFormValues: PurchaseOrderFormValues = {
  orderNumber: "",
  vendorId: "",
  status: "draft",
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  tags: [],
};

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Approved", value: "approved" },
  { label: "Ordered", value: "ordered" },
  { label: "Partial", value: "partial" },
  { label: "Received", value: "received" },
  { label: "Cancelled", value: "cancelled" },
];

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
            {(form) => (
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
                    name="subtotal"
                    label="Subtotal"
                    type="number"
                    required
                  />
                  <FormInputField
                    name="tax"
                    label="Tax"
                    type="number"
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
                  <h3 className="font-medium">Receiving Details</h3>
                  {(initialData?.status === "partial" ||
                    initialData?.status === "received") && (
                    <>
                      <FormInputField
                        name="receivingDetails.receivedAt"
                        label="Received At"
                        type="text"
                      />
                      <FormInputField
                        name="receivingDetails.receivedBy"
                        label="Received By"
                      />
                      <FormInputField
                        name="receivingDetails.locationId"
                        label="Location"
                      />
                      <FormTextAreaField
                        name="receivingDetails.notes"
                        label="Receiving Notes"
                      />
                    </>
                  )}
                  {(initialData?.status === "approved" ||
                    initialData?.status === "ordered") && (
                    <>
                      <FormInputField name="approvedBy" label="Approved By" />
                      <FormInputField
                        name="approvedAt"
                        label="Approved At"
                        type="text"
                      />
                    </>
                  )}
                </div>
                <div className="col-span-2">
                  <FormTextAreaField name="notes" label="Order Notes" />
                </div>
              </div>
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
