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
import type { Vendor } from "@/lib/types/vendor";
import { vendorActions } from "@/lib/state/vendors";

const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean().default(true),
  address: z.string().min(1, "Address is required"),
  contact: z.object({
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email").optional(),
  }),
  leadTime: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const defaultFormValues: VendorFormValues = {
  name: "",
  isActive: true,
  address: "",
  contact: {
    phone: "",
    email: "",
  },
  notes: "",
};

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
                    name="name"
                    label="Name"
                    placeholder="Enter vendor name"
                    required
                  />
                  <FormInputField
                    name="address"
                    label="Address"
                    placeholder="Enter full address"
                    required
                  />
                  <FormInputField
                    name="contact.phone"
                    label="Phone"
                    placeholder="Enter phone number"
                    required
                  />
                  <FormInputField
                    name="contact.email"
                    label="Email"
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-4">
                  <FormInputField
                    name="leadTime"
                    label="Lead Time (days)"
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
