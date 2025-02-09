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

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`capitalize ${
          row.original.isActive ? "text-green-500" : "text-gray-500"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "leadTime",
    header: "Lead Time",
    cell: ({ row }) =>
      row.original.leadTime ? `${row.original.leadTime} days` : "-",
  },
];

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
          searchKey="name"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {vendorList.length} vendors
              </span>
              <span className="text-sm text-muted-foreground">
                Active: {vendorList.filter((v) => v.isActive).length}
              </span>
            </div>
          }
        />
      </div>
      <VendorForm open={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
