"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Customer } from "@/lib/types/customer";
import { customerStore } from "@/lib/state/customers";
import { useObservable } from "@legendapp/state/react";
import { CustomerForm } from "./customer-form";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contacts",
    header: "Primary Contact",
    cell: ({ row }) => {
      const primaryContact = row.original.contacts[0];
      if (!primaryContact) return "-";
      return (
        <div>
          <div>{primaryContact.name}</div>
          <div className="text-sm text-muted-foreground">
            {primaryContact.contactType === "email"
              ? primaryContact.email
              : primaryContact.phone}
          </div>
        </div>
      );
    },
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
];

export function CustomerList() {
  const [isCreating, setIsCreating] = useState(false);
  const customers = useObservable(customerStore.items);
  const customerList = Object.values(customers.get() || {});

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={customerList}
          searchKey="name"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {customerList.length} customers
              </span>
              <span className="text-sm text-muted-foreground">
                Active: {customerList.filter((c) => c.isActive).length}
              </span>
            </div>
          }
        />
      </div>
      <CustomerForm open={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
