"use client";

import { useObservable } from "@legendapp/state/react";
import { salesStore } from "@/lib/state/sales";
import { formatCurrency } from "@/lib/utils/format";
import type { SalesOrder, SalesOrderStatus } from "@/lib/types/sales";

export function SalesMetrics() {
  const sales = useObservable(salesStore);
  const salesMap = sales.items.get() ?? {};
  const allSales = Object.values(salesMap) as SalesOrder[];

  const metrics = {
    totalSales: allSales.reduce((sum, sale) => sum + sale.total, 0),
    averageOrderValue:
      allSales.length > 0
        ? allSales.reduce((sum, sale) => sum + sale.total, 0) / allSales.length
        : 0,
    totalOrders: allSales.length,
    pendingOrders: allSales.filter((sale) => sale.status === "processing")
      .length,
  };

  const salesByStatus = allSales.reduce(
    (acc, sale) => {
      if (!acc[sale.status]) {
        acc[sale.status] = [];
      }
      acc[sale.status].push(sale);
      return acc;
    },
    {} as Record<SalesOrderStatus, SalesOrder[]>,
  );

  const recentSales = [...allSales]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sales Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Sales
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalSales)}
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
          {Object.entries(salesByStatus).map(([status, sales]) => (
            <div key={status} className="space-y-2">
              <div className="text-sm font-medium capitalize">{status}</div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Count: {sales.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total:{" "}
                  {formatCurrency(
                    sales.reduce((sum, sale) => sum + sale.total, 0),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Recent Sales</h3>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div>
                <div className="font-medium">Order #{sale.orderNumber}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(sale.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(sale.total)}</div>
                <div className="text-sm capitalize text-muted-foreground">
                  {sale.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
