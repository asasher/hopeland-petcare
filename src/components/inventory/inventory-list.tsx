"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table/data-table";
import { inventoryStore } from "@/lib/state/inventory";
import { useObservable } from "@legendapp/state/react";
import { AdjustmentForm } from "./adjustment-form";
import { productStore } from "@/lib/state/products";

export function InventoryList() {
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const inventory = useObservable(inventoryStore.items);
  const products = useObservable(productStore.items);
  const inventoryList = Object.values(inventory.get() ?? {}).map((item) => ({
    ...item,
    product: products.get()?.[item.productId]?.name ?? "Unknown Product",
  }));

  const columns = [
    {
      accessorKey: "product",
      header: "Product",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
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

      <DataTable
        columns={columns}
        data={inventoryList}
        searchKey="product"
        toolbar={
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {inventoryList.length} items
            </span>
          </div>
        }
      />

      {showAdjustmentForm && (
        <AdjustmentForm onClose={() => setShowAdjustmentForm(false)} />
      )}
    </div>
  );
}
