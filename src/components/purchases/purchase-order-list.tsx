"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { PurchaseOrder } from "@/lib/types/purchase";
import { purchaseStore } from "@/lib/state/purchases";
import { useObservable } from "@legendapp/state/react";
import { PurchaseOrderForm } from "./purchase-order-form";
import { formatCurrency } from "@/lib/utils/format";

const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`capitalize ${getStatusColor(row.original.status)}`}>
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.total),
  },
  {
    accessorKey: "expectedDeliveryDate",
    header: "Expected Delivery",
    cell: ({ row }) =>
      row.original.expectedDeliveryDate
        ? new Date(row.original.expectedDeliveryDate).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    draft: "text-gray-500",
    ordered: "text-yellow-500",
    received: "text-green-500",
    cancelled: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
};

export function PurchaseOrderList() {
  const [isCreating, setIsCreating] = useState(false);
  const orders = useObservable(purchaseStore.items);
  const orderList = Object.values(orders.get() || {});

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={orderList}
          searchKey="orderNumber"
          toolbar={
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {orderList.length} orders
              </span>
              <span className="text-sm text-muted-foreground">
                Total Expenses:{" "}
                {formatCurrency(
                  orderList.reduce(
                    (sum, order) =>
                      order.status === "received" ? sum + order.total : sum,
                    0,
                  ),
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                Pending Receival:{" "}
                {formatCurrency(
                  orderList.reduce(
                    (sum, order) =>
                      order.status === "ordered"
                        ? sum +
                          order.items.reduce(
                            (itemSum, item) =>
                              itemSum +
                              ((item.receivedQuantity ?? 0) - item.quantity) *
                                item.price,
                            0,
                          )
                        : sum,
                    0,
                  ),
                )}
              </span>
            </div>
          }
        />
      </div>
      <PurchaseOrderForm
        open={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </div>
  );
}
