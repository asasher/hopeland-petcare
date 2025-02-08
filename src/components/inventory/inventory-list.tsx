"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { inventoryStore } from "@/lib/state/inventory";
import { useObservable } from "@legendapp/state/react";
import { AdjustmentForm } from "./adjustment-form";

export function InventoryList() {
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const inventory = useObservable(inventoryStore.stockByLocation);
  const stockByLocation = Object.values(inventory.get() ?? {});

  const columns = [
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "product",
      header: "Product",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "reorderPoint",
      header: "Reorder Point",
    },
    {
      accessorKey: "reorderQuantity",
      header: "Reorder Quantity",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory</h2>
        <Button onClick={() => setShowAdjustmentForm(true)}>
          New Adjustment
        </Button>
      </div>

      <DataTable columns={columns} data={stockByLocation} />

      {showAdjustmentForm && (
        <AdjustmentForm onClose={() => setShowAdjustmentForm(false)} />
      )}
    </div>
  );
}
