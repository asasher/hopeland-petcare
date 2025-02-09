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
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  contacts: z.array(
    z.discriminatedUnion("contactType", [
      z.object({
        contactType: z.literal("email"),
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        phone: z.string().optional(),
        role: z.string().min(1, "Role is required"),
      }),
      z.object({
        contactType: z.literal("phone"),
        name: z.string().min(1, "Name is required"),
        email: z.string().email().optional(),
        phone: z.string().min(1, "Phone is required"),
        role: z.string().min(1, "Role is required"),
      }),
    ]),
  ),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const defaultFormValues: CustomerFormValues = {
  name: "",
  isActive: true,
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  contacts: [],
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
        <DialogContent className="sm:max-w-[800px]">
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
            {(form) => (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormInputField
                    name="name"
                    label="Name"
                    placeholder="Enter customer name"
                    required
                  />
                  <FormInputField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter email address"
                    required
                  />
                  <FormInputField
                    name="phone"
                    label="Phone"
                    placeholder="Enter phone number"
                    required
                  />
                  <FormInputField
                    name="address.street"
                    label="Street"
                    placeholder="Enter street address"
                    required
                  />
                  <FormInputField
                    name="address.city"
                    label="City"
                    placeholder="Enter city"
                    required
                  />
                  <FormInputField
                    name="address.state"
                    label="State"
                    placeholder="Enter state"
                    required
                  />
                  <FormInputField
                    name="address.postalCode"
                    label="Postal Code"
                    placeholder="Enter postal code"
                    required
                  />
                  <FormInputField
                    name="address.country"
                    label="Country"
                    placeholder="Enter country"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <FormSwitchField
                    name="isActive"
                    label="Active"
                    description="Customer account is active"
                  />
                  <FormTextAreaField
                    name="notes"
                    label="Notes"
                    placeholder="Enter any notes about the customer"
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
