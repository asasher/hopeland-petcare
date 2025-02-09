"use client";

import { useObservable } from "@legendapp/state/react";
import { purchaseStore } from "@/lib/state/purchases";
import { formatCurrency } from "@/lib/utils/format";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/lib/types/purchase";

export function PurchasesMetrics() {
  const purchases = useObservable(purchaseStore);
  const ordersMap = purchases.items.get() ?? {};
  const allOrders = Object.values(ordersMap) as PurchaseOrder[];

  const metrics = {
    totalPurchases: allOrders.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue:
      allOrders.length > 0
        ? allOrders.reduce((sum, order) => sum + order.total, 0) /
          allOrders.length
        : 0,
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter((order) => order.status === "ordered")
      .length,
  };

  const ordersByStatus = allOrders.reduce(
    (acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = [];
      }
      acc[order.status].push(order);
      return acc;
    },
    {} as Record<PurchaseOrderStatus, PurchaseOrder[]>,
  );

  const recentOrders = [...allOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Purchases Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Purchases
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalPurchases)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Average Order Value
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.averageOrderValue)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Orders
          </div>
          <div className="mt-2 text-2xl font-bold">{metrics.totalOrders}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Pending Orders
          </div>
          <div className="mt-2 text-2xl font-bold">{metrics.pendingOrders}</div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Orders by Status</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(ordersByStatus).map(([status, orders]) => (
            <div key={status} className="space-y-2">
              <div className="text-sm font-medium capitalize">{status}</div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Count: {orders.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total:{" "}
                  {formatCurrency(
                    orders.reduce((sum, order) => sum + order.total, 0),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Recent Orders</h3>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div>
                <div className="font-medium">Order #{order.orderNumber}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(order.total)}</div>
                <div className="text-sm capitalize text-muted-foreground">
                  {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
