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
  SalesOrder,
  SalesOrderStatus,
  PaymentStatus,
} from "@/lib/types/sales";
import { salesActions } from "@/lib/state/sales";

const salesOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.string().min(1, "Customer is required"),
  status: z.enum([
    "draft",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ] as const),
  paymentStatus: z.enum([
    "pending",
    "partial",
    "paid",
    "refunded",
    "void",
  ] as const),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      discount: z.number().min(0),
      tax: z.number().min(0),
      total: z.number().min(0),
      notes: z.string().optional(),
    }),
  ),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
  shippingDetails: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().min(1),
    phone: z.string().min(1),
    trackingNumber: z.string().optional(),
    carrier: z.string().optional(),
    estimatedDelivery: z.string().optional(),
  }),
  paymentDetails: z.object({
    method: z.string().min(1),
    transactionId: z.string().optional(),
    amount: z.number().min(0),
    currency: z.string().min(1),
    paidAt: z.string().optional(),
    notes: z.string().optional(),
  }),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

const defaultFormValues: SalesOrderFormValues = {
  orderNumber: "",
  customerId: "",
  status: "draft",
  paymentStatus: "pending",
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  shippingDetails: {
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
  },
  paymentDetails: {
    method: "",
    amount: 0,
    currency: "USD",
  },
  notes: "",
  tags: [],
};

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const paymentStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partial" },
  { label: "Paid", value: "paid" },
  { label: "Refunded", value: "refunded" },
  { label: "Void", value: "void" },
];

interface SalesOrderFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: SalesOrder;
}

export function SalesOrderForm({
  open,
  onClose,
  initialData,
}: SalesOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SalesOrderFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        salesActions.updateOrder(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        salesActions.addOrder({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving sales order:", error);
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
              {initialData ? "Edit Sales Order" : "Create Sales Order"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={salesOrderSchema}
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
                    name="customerId"
                    label="Customer"
                    placeholder="Select customer"
                    required
                  />
                  <FormSelectField
                    name="status"
                    label="Status"
                    options={statusOptions}
                    required
                  />
                  <FormSelectField
                    name="paymentStatus"
                    label="Payment Status"
                    options={paymentStatusOptions}
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
                    name="shipping"
                    label="Shipping"
                    type="number"
                    required
                  />
                  <FormInputField
                    name="discount"
                    label="Discount"
                    type="number"
                    required
                  />
                  <FormInputField
                    name="total"
                    label="Total"
                    type="number"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Shipping Details</h3>
                  <FormInputField
                    name="shippingDetails.address"
                    label="Address"
                    required
                  />
                  <FormInputField
                    name="shippingDetails.city"
                    label="City"
                    required
                  />
                  <FormInputField
                    name="shippingDetails.state"
                    label="State"
                    required
                  />
                  <FormInputField
                    name="shippingDetails.country"
                    label="Country"
                    required
                  />
                  <FormInputField
                    name="shippingDetails.postalCode"
                    label="Postal Code"
                    required
                  />
                  <FormInputField
                    name="shippingDetails.phone"
                    label="Phone"
                    required
                  />
                  <FormInputField
                    name="shippingDetails.trackingNumber"
                    label="Tracking Number"
                  />
                  <FormInputField
                    name="shippingDetails.carrier"
                    label="Carrier"
                  />
                  <FormInputField
                    name="shippingDetails.estimatedDelivery"
                    label="Estimated Delivery"
                  />
                </div>
                <div className="col-span-2 space-y-4">
                  <h3 className="font-medium">Payment Details</h3>
                  <FormInputField
                    name="paymentDetails.method"
                    label="Payment Method"
                    required
                  />
                  <FormInputField
                    name="paymentDetails.transactionId"
                    label="Transaction ID"
                  />
                  <FormInputField
                    name="paymentDetails.amount"
                    label="Amount"
                    type="number"
                    required
                  />
                  <FormInputField
                    name="paymentDetails.currency"
                    label="Currency"
                    required
                  />
                  <FormInputField
                    name="paymentDetails.paidAt"
                    label="Paid At"
                    type="text"
                  />
                  <FormTextAreaField
                    name="paymentDetails.notes"
                    label="Payment Notes"
                  />
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
