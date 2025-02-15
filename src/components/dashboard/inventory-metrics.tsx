"use client";

import { useObservable } from "@legendapp/state/react";
import { inventoryStore } from "@/lib/state/inventory";
import { formatCurrency } from "@/lib/utils/format";
import type { InventoryItem } from "@/lib/types/inventory";
import { productStore } from "@/lib/state/products";

export function InventoryMetrics() {
  const inventory = useObservable(inventoryStore.items);
  const products = useObservable(productStore.items);
  const inventoryList = Object.values(inventory.get() ?? {});

  const metrics = {
    totalItems: inventoryList.length,
    totalValue: inventoryList.reduce((sum, item) => {
      const product = products.get()?.[item.productId];
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0),
    lowStockItems: inventoryList.filter((item) => item.quantity <= 5).length,
    outOfStockItems: inventoryList.filter((item) => item.quantity === 0).length,
  };

  const recentInventory = [...inventoryList]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Items
          </div>
          <div className="mt-2 text-2xl font-bold">{metrics.totalItems}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Value
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalValue)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </div>
          <div className="mt-2 text-2xl font-bold text-yellow-500">
            {metrics.lowStockItems}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Out of Stock Items
          </div>
          <div className="mt-2 text-2xl font-bold text-red-500">
            {metrics.outOfStockItems}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Recent Inventory Updates</h3>
        <div className="space-y-4">
          {recentInventory.map((item) => {
            const product = products.get()?.[item.productId];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <div className="font-medium">
                    {product?.name ?? "Unknown Product"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.quantity} units</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency((product?.price ?? 0) * item.quantity)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
