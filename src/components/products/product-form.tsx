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
import type { Product } from "@/lib/types/product";
import { productActions } from "@/lib/state/products";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productSchema>;

const defaultFormValues: ProductFormValues = {
  name: "",
  description: "",
  isActive: true,
  notes: "",
  tags: [],
};

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Product;
}

export function ProductForm({ open, onClose, initialData }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        productActions.updateProduct(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        productActions.addProduct({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          images: [],
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
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
              {initialData ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={productSchema}
            onSubmit={handleSubmit}
            defaultValues={initialData ?? defaultFormValues}
            isSubmitting={isSubmitting}
          >
            {(form) => (
              <>
                <FormInputField
                  name="name"
                  label="Name"
                  placeholder="Enter product name"
                  required
                />
                <FormTextAreaField
                  name="description"
                  label="Description"
                  placeholder="Enter product description"
                  required
                />
                <FormSwitchField
                  name="isActive"
                  label="Active"
                  description="Product will be visible to customers"
                />
                <FormTextAreaField
                  name="notes"
                  label="Internal Notes"
                  placeholder="Add any internal notes"
                />
              </>
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
