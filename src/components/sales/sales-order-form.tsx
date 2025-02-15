"use client";

import { useState, useEffect } from "react";
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
import type { SalesOrder } from "@/lib/types/sales";
import { salesActions } from "@/lib/state/sales";
import { customerStore } from "@/lib/state/customers";
import { useObservable } from "@legendapp/state/react";
import { useForm } from "react-hook-form";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const salesOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.string().min(1, "Customer is required"),
  status: z.enum([
    "draft",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ] as const),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
      price: z.coerce
        .number()
        .min(0, "Price must be greater than or equal to 0"),
      total: z.coerce.number().min(0),
    }),
  ),
  total: z.coerce.number().min(0),
  shipping: z.object({
    address: z.string().min(1),
    phone: z.string().min(1),
  }),
  isPaid: z.boolean().default(false),
  paidAt: z.string().optional(),
  notes: z.string().optional(),
});

type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

const defaultFormValues: SalesOrderFormValues = {
  orderNumber: "",
  customerId: "",
  status: "draft",
  items: [
    {
      productId: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ],
  total: 0,
  shipping: {
    address: "",
    phone: "",
  },
  isPaid: false,
  notes: "",
};

interface SalesOrderFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: SalesOrder;
}

function SalesOrderFormFields({
  form,
  customerList,
}: {
  form: ReturnType<typeof useForm<SalesOrderFormValues>>;
  customerList: Array<{
    id: string;
    name: string;
    address: string;
    contact: { phone: string };
  }>;
}) {
  const watchQuantity = form.watch("items.0.quantity");
  const watchPrice = form.watch("items.0.price");
  const selectedCustomer = customerList.find(
    (c) => c.id === form.watch("customerId"),
  );

  useEffect(() => {
    const quantity = Number(watchQuantity) || 0;
    const price = Number(watchPrice) || 0;
    const total = quantity * price;
    form.setValue("items.0.total", total);
    form.setValue("total", total);
  }, [watchQuantity, watchPrice, form]);

  useEffect(() => {
    if (selectedCustomer) {
      form.setValue("shipping.address", selectedCustomer.address);
      form.setValue("shipping.phone", selectedCustomer.contact.phone);
    }
  }, [selectedCustomer, form]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <h3 className="font-medium">Order Details</h3>
        <FormInputField
          name="orderNumber"
          label="Order Number"
          disabled
          required
        />
        <FormSelectField
          name="customerId"
          label="Customer"
          options={customerList.map((customer) => ({
            label: customer.name,
            value: customer.id,
          }))}
          required
        />
        <FormSelectField
          name="status"
          label="Status"
          options={statusOptions}
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <FormInputField
            name="items.0.quantity"
            label="Quantity"
            type="number"
            required
          />
          <FormInputField
            name="items.0.price"
            label="Price"
            type="number"
            required
          />
        </div>
        <FormInputField
          name="total"
          label="Total"
          type="number"
          disabled
          required
        />
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Shipping Details</h3>
        <FormInputField name="shipping.address" label="Address" required />
        <FormInputField name="shipping.phone" label="Phone" required />
        <FormTextAreaField
          name="notes"
          label="Notes"
          placeholder="Add any notes about this order"
        />
      </div>
    </div>
  );
}

export function SalesOrderForm({
  open,
  onClose,
  initialData,
}: SalesOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customers = useObservable(customerStore.items);
  const customerList = Object.values(customers.get() ?? {});

  const generateOrderNumber = () => {
    const prefix = "SO";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  };

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
            defaultValues={{
              ...defaultFormValues,
              orderNumber: generateOrderNumber(),
              ...initialData,
            }}
            isSubmitting={isSubmitting}
          >
            {(form) => (
              <SalesOrderFormFields form={form} customerList={customerList} />
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
