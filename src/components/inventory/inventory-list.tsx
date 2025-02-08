"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { InventoryItem } from "@/lib/types/inventory";
import { inventoryStore } from "@/lib/state/inventory";
import { useObservable } from "@legendapp/state/react";
import { formatCurrency } from "@/lib/utils/format";
import { AdjustmentForm } from "./adjustment-form";

const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("category")}</span>
    ),
  },
  {
    accessorKey: "stockLevel",
    header: "Stock Level",
    cell: ({ row }) => (
      <span
        className={`${
          row.getValue("stockLevel") <= row.original.reorderPoint
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {row.getValue("stockLevel")} {row.original.unit}
      </span>
    ),
  },
  {
    accessorKey: "reorderPoint",
    header: "Reorder Point",
    cell: ({ row }) => (
      <span>
        {row.getValue("reorderPoint")} {row.original.unit}
      </span>
    ),
  },
  {
    accessorKey: "averageCost",
    header: "Average Cost",
    cell: ({ row }) => formatCurrency(row.getValue("averageCost")),
  },
  {
    accessorKey: "value",
    header: "Total Value",
    cell: ({ row }) =>
      formatCurrency(
        (row.original.stockLevel ?? 0) * (row.original.averageCost ?? 0),
      ),
  },
  {
    accessorKey: "location",
    header: "Location",
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

const getStatusColor = (status: string) => {
  const colors = {
    active: "text-green-500",
    inactive: "text-gray-500",
    discontinued: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
};

export function InventoryList() {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const inventory = useObservable(inventoryStore.items);
  const inventoryList = Object.values(inventory.get() ?? {});

  const handleAdjust = () => {
    setIsAdjusting(true);
  };

  const totalValue = inventoryList.reduce(
    (sum, item) => sum + (item.stockLevel ?? 0) * (item.averageCost ?? 0),
    0,
  );

  const lowStockItems = inventoryList.filter(
    (item) => item.stockLevel <= item.reorderPoint,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Button onClick={handleAdjust}>
          <Plus className="mr-2 h-4 w-4" />
          New Adjustment
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Items
          </div>
          <div className="mt-2 text-2xl font-bold">
            {inventoryList.length} items
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Value
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(totalValue)}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </div>
          <div className="mt-2 text-2xl font-bold text-red-500">
            {lowStockItems.length} items
          </div>
        </div>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={inventoryList}
          searchKey="name"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {inventoryList.length} items
              </span>
              <span className="text-sm text-muted-foreground">
                Active:{" "}
                {inventoryList.filter((i) => i.status === "active").length}
              </span>
              <span className="text-sm text-muted-foreground">
                Low Stock: {lowStockItems.length}
              </span>
            </div>
          }
        />
      </div>
      <AdjustmentForm
        open={isAdjusting}
        onClose={() => setIsAdjusting(false)}
      />
    </div>
  );
}
