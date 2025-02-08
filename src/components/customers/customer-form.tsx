"use client";

import { useState } from "react";
import { z } from "zod";
import { BaseForm } from "@/components/ui/form/base-form";
import {
  FormInputField,
  FormTextAreaField,
  FormSelectField,
  FormSwitchField,
} from "@/components/ui/form/form-field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import type { Customer, CustomerStatus } from "@/lib/types/customer";
import { customerActions } from "@/lib/state/customers";

const customerSchema = z.object({
  code: z.string().min(1, "Customer code is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"] as const),
  addresses: z.array(
    z.object({
      type: z.enum(["billing", "shipping"] as const),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().min(1),
      isDefault: z.boolean(),
    }),
  ),
  contacts: z.array(
    z.object({
      type: z.enum(["phone", "email", "other"] as const),
      value: z.string().min(1),
      isPrimary: z.boolean(),
    }),
  ),
  preferences: z.object({
    preferredContactMethod: z.enum(["phone", "email", "sms"] as const),
    marketingOptIn: z.boolean(),
    notificationSettings: z.object({
      orderUpdates: z.boolean(),
      promotions: z.boolean(),
      newsletter: z.boolean(),
    }),
  }),
  taxId: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  creditLimit: z.number().optional(),
  balance: z.number(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const defaultFormValues: CustomerFormValues = {
  code: "",
  firstName: "",
  lastName: "",
  company: "",
  status: "active",
  addresses: [],
  contacts: [],
  preferences: {
    preferredContactMethod: "email",
    marketingOptIn: false,
    notificationSettings: {
      orderUpdates: true,
      promotions: false,
      newsletter: false,
    },
  },
  tags: [],
  balance: 0,
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

const contactMethodOptions = [
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
];

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
                    name="code"
                    label="Customer Code"
                    placeholder="Enter customer code"
                    required
                  />
                  <FormInputField
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    required
                  />
                  <FormInputField
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                  />
                  <FormInputField
                    name="company"
                    label="Company"
                    placeholder="Enter company name"
                  />
                  <FormSelectField
                    name="status"
                    label="Status"
                    options={statusOptions}
                    required
                  />
                  <FormInputField
                    name="taxId"
                    label="Tax ID"
                    placeholder="Enter tax ID"
                  />
                  <FormInputField
                    name="creditLimit"
                    label="Credit Limit"
                    type="number"
                  />
                  <FormInputField
                    name="balance"
                    label="Balance"
                    type="number"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Preferences</h3>
                  <FormSelectField
                    name="preferences.preferredContactMethod"
                    label="Preferred Contact Method"
                    options={contactMethodOptions}
                    required
                  />
                  <FormSwitchField
                    name="preferences.marketingOptIn"
                    label="Marketing Opt-in"
                  />
                  <h4 className="mt-4 font-medium">Notification Settings</h4>
                  <FormSwitchField
                    name="preferences.notificationSettings.orderUpdates"
                    label="Order Updates"
                  />
                  <FormSwitchField
                    name="preferences.notificationSettings.promotions"
                    label="Promotions"
                  />
                  <FormSwitchField
                    name="preferences.notificationSettings.newsletter"
                    label="Newsletter"
                  />
                </div>
                <div className="col-span-2">
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
