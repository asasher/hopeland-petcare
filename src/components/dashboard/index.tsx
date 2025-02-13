"use client";

import { InventoryMetrics } from "./inventory-metrics";

export function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <InventoryMetrics />
    </div>
  );
}
