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
import type { Vendor, VendorStatus } from "@/lib/types/vendor";
import { vendorActions } from "@/lib/state/vendors";

const vendorSchema = z.object({
  code: z.string().min(1, "Vendor code is required"),
  name: z.string().min(1, "Name is required"),
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
  taxId: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  creditLimit: z.number().optional(),
  balance: z.number(),
  rating: z.number().min(0).max(5).optional(),
  leadTime: z.number().min(0).optional(),
  minimumOrderValue: z.number().min(0).optional(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const defaultFormValues: VendorFormValues = {
  code: "",
  name: "",
  status: "active",
  addresses: [],
  contacts: [],
  tags: [],
  balance: 0,
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

interface VendorFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Vendor;
}

export function VendorForm({ open, onClose, initialData }: VendorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: VendorFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        vendorActions.updateVendor(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        vendorActions.addVendor({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving vendor:", error);
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
              {initialData ? "Edit Vendor" : "Create Vendor"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={vendorSchema}
            onSubmit={handleSubmit}
            defaultValues={initialData ?? defaultFormValues}
            isSubmitting={isSubmitting}
          >
            {(form) => (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormInputField
                    name="code"
                    label="Vendor Code"
                    placeholder="Enter vendor code"
                    required
                  />
                  <FormInputField
                    name="name"
                    label="Name"
                    placeholder="Enter vendor name"
                    required
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
                    name="website"
                    label="Website"
                    placeholder="Enter website URL"
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
                  <FormInputField
                    name="rating"
                    label="Rating (0-5)"
                    type="number"
                  />
                  <FormInputField
                    name="leadTime"
                    label="Lead Time (days)"
                    type="number"
                  />
                  <FormInputField
                    name="minimumOrderValue"
                    label="Minimum Order Value"
                    type="number"
                  />
                  <FormTextAreaField
                    name="notes"
                    label="Notes"
                    placeholder="Enter any notes about the vendor"
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
