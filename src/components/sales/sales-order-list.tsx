"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { SalesOrder } from "@/lib/types/sales";
import { salesStore, salesActions } from "@/lib/state/sales";
import { useObservable } from "@legendapp/state/react";
import { SalesOrderForm } from "./sales-order-form";
import { formatCurrency } from "@/lib/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function DeleteOrderDialog({
  order,
  open,
  onOpenChange,
}: {
  order: SalesOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the sales order #{order.orderNumber}.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              salesActions.deleteOrder(order.id);
              onOpenChange(false);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function OrderActions({
  order,
  onEdit,
}: {
  order: SalesOrder;
  onEdit: (order: SalesOrder) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onEdit(order)}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteOrderDialog
        order={order}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}

const getStatusColor = (status: string) => {
  const colors = {
    draft: "text-gray-500",
    confirmed: "text-blue-500",
    shipped: "text-yellow-500",
    delivered: "text-green-500",
    cancelled: "text-red-500",
  };
  return colors[status as keyof typeof colors] || "text-gray-500";
};

export function SalesOrderList() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const orders = useObservable(salesStore.items);
  const orderList = Object.values(orders.get() || {});

  const handleCreate = () => {
    setSelectedOrder(null);
    setIsCreating(true);
  };

  const columns: ColumnDef<SalesOrder>[] = [
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
      accessorKey: "isPaid",
      header: "Payment",
      cell: ({ row }) => (
        <span
          className={`capitalize ${row.original.isPaid ? "text-green-500" : "text-yellow-500"}`}
        >
          {row.original.isPaid ? "Paid" : "Pending"}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <OrderActions
          order={row.original}
          onEdit={(order) => {
            setSelectedOrder(order);
            setIsCreating(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Orders</h2>
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
                Total Revenue:{" "}
                {formatCurrency(
                  orderList.reduce(
                    (sum, order) => (order.isPaid ? sum + order.total : sum),
                    0,
                  ),
                )}
              </span>
            </div>
          }
        />
      </div>
      <SalesOrderForm
        open={isCreating}
        onClose={() => {
          setIsCreating(false);
          setSelectedOrder(null);
        }}
        initialData={selectedOrder ?? undefined}
      />
    </div>
  );
}
