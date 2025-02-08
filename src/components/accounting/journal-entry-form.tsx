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
  JournalEntry,
  TransactionType,
  JournalEntryStatus,
} from "@/lib/types/accounting";
import { accountingStore, accountingActions } from "@/lib/state/accounting";
import { useObservable } from "@legendapp/state/react";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

const journalEntryLineSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  description: z.string().min(1, "Description is required"),
  debit: z.number().min(0),
  credit: z.number().min(0),
});

const journalEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  reference: z.string().min(1, "Reference is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum([
    "sale",
    "purchase",
    "payment",
    "receipt",
    "journal",
    "adjustment",
    "credit-note",
    "debit-note",
  ]) satisfies z.ZodType<TransactionType>,
  status: z.enum([
    "draft",
    "posted",
    "voided",
  ]) satisfies z.ZodType<JournalEntryStatus>,
  amount: z.number().min(0),
  lines: z
    .array(journalEntryLineSchema)
    .min(1, "At least one line is required"),
  notes: z
    .string()
    .nullish()
    .transform((val) => val ?? ""),
  tags: z.array(z.string()).default([]),
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

const defaultFormValues: JournalEntryFormValues = {
  date: new Date().toISOString().split("T")[0],
  reference: "",
  description: "",
  type: "journal",
  status: "draft",
  amount: 0,
  lines: [
    {
      accountId: "",
      description: "",
      debit: 0,
      credit: 0,
    },
  ],
  notes: "",
  tags: [],
};

const typeOptions: Array<{ label: string; value: TransactionType }> = [
  { label: "Sale", value: "sale" },
  { label: "Purchase", value: "purchase" },
  { label: "Payment", value: "payment" },
  { label: "Receipt", value: "receipt" },
  { label: "Journal", value: "journal" },
  { label: "Adjustment", value: "adjustment" },
  { label: "Credit Note", value: "credit-note" },
  { label: "Debit Note", value: "debit-note" },
];

const statusOptions: Array<{ label: string; value: JournalEntryStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Posted", value: "posted" },
  { label: "Voided", value: "voided" },
];

interface JournalEntryFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: JournalEntry;
}

export function JournalEntryForm({
  open,
  onClose,
  initialData,
}: JournalEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accounts = useObservable(accountingStore.accounts);
  const accountList = Object.values(accounts.get() ?? {});
  const accountOptions = accountList.map((account) => ({
    label: `${account.code} - ${account.name}`,
    value: account.id,
  }));

  const handleSubmit = async (data: JournalEntryFormValues) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        accountingActions.updateJournalEntry(initialData.id, {
          ...initialData,
          ...data,
        });
      } else {
        accountingActions.addJournalEntry({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving journal entry:", error);
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
              {initialData ? "Edit Journal Entry" : "Create Journal Entry"}
            </DialogTitle>
          </DialogHeader>
          <BaseForm
            schema={journalEntrySchema}
            onSubmit={handleSubmit}
            defaultValues={initialData ?? defaultFormValues}
            isSubmitting={isSubmitting}
          >
            {(form) => (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormInputField
                      name="date"
                      label="Date"
                      type="text"
                      required
                    />
                    <FormInputField
                      name="reference"
                      label="Reference"
                      placeholder="Enter reference number"
                      required
                    />
                    <FormTextAreaField
                      name="description"
                      label="Description"
                      placeholder="Enter description"
                      required
                    />
                    <FormSelectField
                      name="type"
                      label="Type"
                      options={typeOptions}
                      required
                    />
                    <FormSelectField
                      name="status"
                      label="Status"
                      options={statusOptions}
                      required
                    />
                    <FormInputField
                      name="amount"
                      label="Amount"
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Additional Details</h3>
                    {initialData?.status === "posted" && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Posted At</div>
                        <div className="text-sm text-muted-foreground">
                          {initialData.postedAt}
                        </div>
                        <div className="text-sm font-medium">Posted By</div>
                        <div className="text-sm text-muted-foreground">
                          {initialData.postedBy}
                        </div>
                      </div>
                    )}
                    {initialData?.status === "voided" && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Voided At</div>
                        <div className="text-sm text-muted-foreground">
                          {initialData.voidedAt}
                        </div>
                        <div className="text-sm font-medium">Voided By</div>
                        <div className="text-sm text-muted-foreground">
                          {initialData.voidedBy}
                        </div>
                      </div>
                    )}
                    <FormTextAreaField
                      name="notes"
                      label="Notes"
                      placeholder="Enter any additional notes"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Journal Entry Lines</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const lines = form.getValues("lines") || [];
                        form.setValue("lines", [
                          ...lines,
                          {
                            accountId: "",
                            description: "",
                            debit: 0,
                            credit: 0,
                          },
                        ]);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Line
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {form.watch("lines")?.map((_, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4">
                        <div className="col-span-2">
                          <FormSelectField
                            name={`lines.${index}.accountId`}
                            label="Account"
                            options={accountOptions}
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormInputField
                            name={`lines.${index}.debit`}
                            label="Debit"
                            type="number"
                            required
                          />
                        </div>
                        <div className="col-span-1">
                          <FormInputField
                            name={`lines.${index}.credit`}
                            label="Credit"
                            type="number"
                            required
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const lines = form.getValues("lines");
                              form.setValue(
                                "lines",
                                lines.filter((_, i) => i !== index),
                              );
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </BaseForm>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
