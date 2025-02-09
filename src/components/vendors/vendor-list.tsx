"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Vendor } from "@/lib/types/vendor";
import { vendorStore } from "@/lib/state/vendors";
import { useObservable } from "@legendapp/state/react";
import { VendorForm } from "./vendor-form";
import { formatCurrency } from "@/lib/utils/format";

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`capitalize ${getStatusColor(row.original.status)}`}>
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => formatCurrency(row.original.balance),
  },
  {
    accessorKey: "creditLimit",
    header: "Credit Limit",
    cell: ({ row }) =>
      row.original.creditLimit ? formatCurrency(row.original.creditLimit) : "-",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => row.original.rating ?? "-",
  },
  {
    accessorKey: "leadTime",
    header: "Lead Time",
    cell: ({ row }) =>
      row.original.leadTime ? `${row.original.leadTime} days` : "-",
  },
  {
    accessorKey: "minimumOrderValue",
    header: "Min. Order",
    cell: ({ row }) =>
      row.original.minimumOrderValue
        ? formatCurrency(row.original.minimumOrderValue)
        : "-",
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    active: "text-green-500",
    inactive: "text-gray-500",
    blocked: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
};

export function VendorList() {
  const [isCreating, setIsCreating] = useState(false);
  const vendors = useObservable(vendorStore.items);
  const vendorList = Object.values(vendors.get() ?? {});

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vendors</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Vendor
        </Button>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={vendorList}
          searchKey="code"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {vendorList.length} vendors
              </span>
              <span className="text-sm text-muted-foreground">
                Active: {vendorList.filter((v) => v.status === "active").length}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Payables:{" "}
                {formatCurrency(
                  vendorList.reduce((sum, vendor) => sum + vendor.balance, 0),
                )}
              </span>
            </div>
          }
        />
      </div>
      <VendorForm open={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
