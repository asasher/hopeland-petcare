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
import { formatCurrency } from "@/lib/utils/format";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "company",
    header: "Company",
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
];

const getStatusColor = (status: string) => {
  const colors = {
    active: "text-green-500",
    inactive: "text-gray-500",
    blocked: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
};

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
          searchKey="code"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {customerList.length} customers
              </span>
              <span className="text-sm text-muted-foreground">
                Active:{" "}
                {customerList.filter((c) => c.status === "active").length}
              </span>
              <span className="text-sm text-muted-foreground">
                Total Receivables:{" "}
                {formatCurrency(
                  customerList.reduce(
                    (sum, customer) => sum + customer.balance,
                    0,
                  ),
                )}
              </span>
            </div>
          }
        />
      </div>
      <CustomerForm open={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
