"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialMetrics } from "./financial-metrics";
import { InventoryMetrics } from "./inventory-metrics";
import { SalesMetrics } from "./sales-metrics";
import { PurchasesMetrics } from "./purchases-metrics";

export function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>
        <TabsContent value="financial">
          <FinancialMetrics />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryMetrics />
        </TabsContent>
        <TabsContent value="sales">
          <SalesMetrics />
        </TabsContent>
        <TabsContent value="purchases">
          <PurchasesMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
