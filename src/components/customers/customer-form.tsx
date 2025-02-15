"use client";

import { useState } from "react";
import { z } from "zod";
import { BaseForm } from "@/components/ui/form/base-form";
import {
  FormInputField,
  FormTextAreaField,
  FormSwitchField,
} from "@/components/ui/form/form-field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import type { Customer } from "@/lib/types/customer";
import { customerActions } from "@/lib/state/customers";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().default(true),
  address: z.string().min(1, "Address is required"),
  contact: z.object({
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email").optional(),
  }),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const defaultFormValues: CustomerFormValues = {
  name: "",
  isActive: true,
  address: "",
  contact: {
    phone: "",
    email: "",
  },
  notes: "",
};

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Customer;
}

export function CustomerForm({
  open,
  onClose,
  initialData,
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        customerActions.updateCustomer(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        customerActions.addCustomer({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogPortal>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Customer" : "Create Customer"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={customerSchema}
            onSubmit={handleSubmit}
            defaultValues={initialData ?? defaultFormValues}
            isSubmitting={isSubmitting}
          >
            {() => (
              <div className="space-y-4">
                <FormInputField
                  name="name"
                  label="Name"
                  placeholder="Enter customer name"
                  required
                />
                <FormInputField
                  name="address"
                  label="Address"
                  placeholder="Enter full address"
                  required
                />
                <div className="space-y-4">
                  <FormInputField
                    name="contact.phone"
                    label="Phone"
                    placeholder="Enter phone number"
                    required
                  />
                  <FormInputField
                    name="contact.email"
                    label="Email"
                    type="email"
                    placeholder="Enter email address"
                  />
                </div>
                <FormSwitchField
                  name="isActive"
                  label="Active"
                  description="Customer account is active"
                />
                <FormTextAreaField
                  name="notes"
                  label="Notes"
                  placeholder="Enter any additional notes"
                />
              </div>
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
