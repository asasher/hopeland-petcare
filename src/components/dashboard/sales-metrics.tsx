"use client";

import { useObservable } from "@legendapp/state/react";
import { salesStore } from "@/lib/state/sales";
import { formatCurrency } from "@/lib/utils/format";

export function SalesMetrics() {
  const sales = useObservable(salesStore.items);
  const allSales = Object.values(sales.get() ?? {});

  const metrics = {
    totalRevenue: allSales.reduce((sum, sale) => sum + sale.total, 0),
    paidRevenue: allSales.reduce(
      (sum, sale) => (sale.isPaid ? sum + sale.total : sum),
      0,
    ),
    unpaidRevenue: allSales.reduce(
      (sum, sale) => (!sale.isPaid ? sum + sale.total : sum),
      0,
    ),
    totalOrders: allSales.length,
    pendingOrders: allSales.filter((sale) => sale.status === "confirmed")
      .length,
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sales Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalRevenue)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Paid Revenue
          </div>
          <div className="mt-2 text-2xl font-bold text-green-500">
            {formatCurrency(metrics.paidRevenue)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Unpaid Revenue
          </div>
          <div className="mt-2 text-2xl font-bold text-yellow-500">
            {formatCurrency(metrics.unpaidRevenue)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Pending Orders
          </div>
          <div className="mt-2 text-2xl font-bold">
            {metrics.pendingOrders} / {metrics.totalOrders}
          </div>
        </div>
      </div>
    </div>
  );
}
