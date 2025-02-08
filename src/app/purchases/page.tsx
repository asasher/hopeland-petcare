"use client";

import { PurchaseOrderList } from "@/components/purchases/purchase-order-list";

export default function PurchasesPage() {
  return (
    <div className="container mx-auto py-6">
      <PurchaseOrderList />
    </div>
  );
}
