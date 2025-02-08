"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { JournalEntry } from "@/lib/types/accounting";
import { accountingStore } from "@/lib/state/accounting";
import { useObservable } from "@legendapp/state/react";
import { formatCurrency } from "@/lib/utils/format";
import { JournalEntryForm } from "./journal-entry-form";

const columns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className={`capitalize ${getTypeColor(row.getValue("type"))}`}>
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`capitalize ${getStatusColor(row.getValue("status"))}`}>
        {row.getValue("status")}
      </span>
    ),
  },
];

const getTypeColor = (type: string) => {
  const colors = {
    sale: "text-green-500",
    purchase: "text-blue-500",
    payment: "text-orange-500",
    receipt: "text-purple-500",
    journal: "text-gray-500",
    adjustment: "text-yellow-500",
    "credit-note": "text-red-500",
    "debit-note": "text-pink-500",
  };
  return colors[type as keyof typeof colors] || "text-gray-500";
};

const getStatusColor = (status: string) => {
  const colors = {
    draft: "text-gray-500",
    posted: "text-green-500",
    voided: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
};

export function JournalEntries() {
  const [isCreating, setIsCreating] = useState(false);
  const entries = useObservable(accountingStore.journalEntries);
  const entryList = Object.values(entries.get() ?? {});

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={entryList}
          searchKey="reference"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {entryList.length} entries
              </span>
              <span className="text-sm text-muted-foreground">
                Posted: {entryList.filter((e) => e.status === "posted").length}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Amount:{" "}
                {formatCurrency(
                  entryList.reduce((sum, entry) => sum + entry.amount, 0),
                )}
              </span>
            </div>
          }
        />
      </div>
      <JournalEntryForm
        open={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </div>
  );
}
