"use client";

import { useObservable } from "@legendapp/state/react";
import { inventoryStore } from "@/lib/state/inventory";
import { formatCurrency } from "@/lib/utils/format";
import type {
  InventoryItem,
  StockLevel,
  InventoryTransaction,
} from "@/lib/types/inventory";

export function InventoryMetrics() {
  const inventory = useObservable(inventoryStore);
  const itemsMap = inventory.items.get() ?? {};
  const allItems = Object.values(itemsMap) as InventoryItem[];

  const metrics = {
    totalItems: allItems.length,
    totalValue: allItems.reduce(
      (sum, item) => sum + item.averageCost * item.stockLevel,
      0,
    ),
    lowStockItems: allItems.filter(
      (item) => item.stockLevel <= item.reorderPoint,
    ).length,
    outOfStockItems: allItems.filter((item) => item.stockLevel === 0).length,
  };

  const stockLevels = inventory.stockLevels.get() ?? {};
  const allStockLevels = Object.values(stockLevels) as StockLevel[];
  const stockByLocation = allStockLevels.reduce(
    (acc, stock) => {
      if (!acc[stock.locationId]) {
        acc[stock.locationId] = [];
      }
      acc[stock.locationId].push(stock);
      return acc;
    },
    {} as Record<string, StockLevel[]>,
  );

  const transactionsMap = inventory.transactions.get() ?? {};
  const allTransactions = Object.values(
    transactionsMap,
  ) as InventoryTransaction[];
  const recentTransactions = [...allTransactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5) as InventoryTransaction[];

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
        <h3 className="mb-4 text-lg font-semibold">Stock by Location</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(stockByLocation).map(([locationId, stocks]) => {
            const locationName =
              inventory.locations.get()?.[locationId]?.name ?? "Unknown";
            const totalValue = stocks.reduce(
              (sum, stock) =>
                sum +
                stock.quantity *
                  ((itemsMap[stock.productId]?.averageCost ?? 0) || 0),
              0,
            );

            return (
              <div key={locationId} className="space-y-2">
                <div className="text-sm font-medium">{locationName}</div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Items: {stocks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Value: {formatCurrency(totalValue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const item = itemsMap[transaction.productId];
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <div className="font-medium">
                    {item?.name ?? "Unknown Product"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString()} -{" "}
                    {transaction.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {transaction.quantity > 0 ? "+" : ""}
                    {transaction.quantity} {item?.unit ?? "units"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(transaction.totalCost)}
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
