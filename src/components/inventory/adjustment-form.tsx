"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { inventoryStore, inventoryActions } from "@/lib/state/inventory";
import { useObservable } from "@legendapp/state/react";
import type { AdjustmentReason } from "@/lib/types/inventory";

const adjustmentSchema = z.object({
  productId: z.string(),
  locationId: z.string(),
  quantity: z.number(),
  reason: z.enum(["damage", "loss", "theft", "expiry", "correction", "other"]),
});

type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

interface AdjustmentFormProps {
  onClose: () => void;
}

export function AdjustmentForm({ onClose }: AdjustmentFormProps) {
  const form = useForm<AdjustmentFormValues>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      productId: "",
      locationId: "",
      quantity: 0,
      reason: "correction",
    },
  });

  const products = useObservable(inventoryStore.items);
  const locations = useObservable(inventoryStore.locations);

  const onSubmit = (values: AdjustmentFormValues) => {
    const adjustment = {
      id: crypto.randomUUID(),
      adjustmentNumber: `ADJ-${Date.now()}`,
      locationId: values.locationId,
      reason: values.reason,
      description: values.reason,
      items: [
        {
          productId: values.productId,
          variantId: "default",
          quantity: values.quantity,
          unitCost: 0,
          totalCost: 0,
        },
      ],
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inventoryActions.addAdjustment(adjustment);
    onClose();
  };

  const reasonOptions: Array<{ label: string; value: AdjustmentReason }> = [
    { label: "Damage", value: "damage" },
    { label: "Loss", value: "loss" },
    { label: "Theft", value: "theft" },
    { label: "Expiry", value: "expiry" },
    { label: "Correction", value: "correction" },
    { label: "Other", value: "other" },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Inventory Adjustment</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(products.get() ?? {}).map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(locations.get() ?? {}).map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
