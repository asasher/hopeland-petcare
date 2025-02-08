"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Account, AccountType } from "@/lib/types/accounting";
import { accountingStore, financialMetrics } from "@/lib/state/accounting";
import { useObservable } from "@legendapp/state/react";
import { formatCurrency } from "@/lib/utils/format";

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className={`capitalize ${getTypeColor(row.original.type)}`}>
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCategory(row.original.category)}
      </span>
    ),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <span
        className={`${
          row.original.balance >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {formatCurrency(row.original.balance)}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`${
          row.original.isActive ? "text-green-500" : "text-gray-500"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const getTypeColor = (type: AccountType) => {
  const colors = {
    asset: "text-blue-500",
    liability: "text-orange-500",
    equity: "text-purple-500",
    revenue: "text-green-500",
    expense: "text-red-500",
  };
  return colors[type];
};

const formatCategory = (category: string) => {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function ChartAccounts() {
  const [isCreating, setIsCreating] = useState(false);
  const accounts = useObservable(accountingStore.accounts);
  const accountList = Object.values(accounts.get() ?? {});
  const metrics = useObservable(financialMetrics);
  const {
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalRevenue,
    totalExpenses,
  } = metrics.get() ?? {
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Assets
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalAssets)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Liabilities
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalLiabilities)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Equity
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalEquity)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={accountList}
          searchKey="name"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {accountList.length} accounts
              </span>
              <span className="text-sm text-muted-foreground">
                Active: {accountList.filter((a) => a.isActive).length}
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}
