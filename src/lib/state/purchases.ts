import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { PurchaseOrder, PurchaseOrderStatus } from "../types/purchase";

// Purchase specific state
type PurchaseState = BaseState<PurchaseOrder> & {
  ordersByStatus: Record<PurchaseOrderStatus, string[]>;
  ordersByVendor: Record<string, string[]>;
  totalExpenses: number;
  pendingPayments: number;
  pendingReceival: number;
};

// Initialize state
const initialState: Partial<PurchaseState> = {
  items: {},
  ordersByStatus: {
    draft: [],
    submitted: [],
    approved: [],
    ordered: [],
    partial: [],
    received: [],
    cancelled: [],
  },
  ordersByVendor: {},
  totalExpenses: 0,
  pendingPayments: 0,
  pendingReceival: 0,
};

// Create the store with type
export const purchaseStore = createDomainStore<PurchaseOrder>(
  "purchases",
  initialState,
) as unknown as Observable<PurchaseState>;

// Computed values
export const ordersByStatus = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return orders.reduce(
    (acc, order) => {
      const status = order.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(order.id);
      return acc;
    },
    {} as Record<PurchaseOrderStatus, string[]>,
  );
});

export const ordersByVendor = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return orders.reduce(
    (acc, order) => {
      const vendorId = order.vendorId;
      if (!acc[vendorId]) {
        acc[vendorId] = [];
      }
      acc[vendorId].push(order.id);
      return acc;
    },
    {} as Record<string, string[]>,
  );
});

export const totalExpenses = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return orders.reduce((total, order) => {
    if (order.status === "received" || order.status === "partial") {
      return total + order.total;
    }
    return total;
  }, 0);
});

export const pendingPayments = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return orders.reduce((total, order) => {
    if (order.status === "received" || order.status === "partial") {
      const receivedItems = order.items.reduce(
        (sum, item) => sum + item.receivedQuantity * item.unitPrice,
        0,
      );
      return total + receivedItems;
    }
    return total;
  }, 0);
});

export const pendingReceival = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return orders.reduce((total, order) => {
    if (order.status === "ordered" || order.status === "partial") {
      const pendingItems = order.items.reduce(
        (sum, item) =>
          sum + (item.quantity - item.receivedQuantity) * item.unitPrice,
        0,
      );
      return total + pendingItems;
    }
    return total;
  }, 0);
});

export const recentOrders = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);
});

// Actions
export const purchaseActions = {
  addOrder: (order: PurchaseOrder) => {
    const items = purchaseStore.items.peek() ?? {};
    purchaseStore.items.set({ ...items, [order.id]: order });

    // Update order status indexes
    const ordersByStatus = purchaseStore.ordersByStatus.peek() ?? {};
    const currentStatusOrders = ordersByStatus[order.status] ?? [];
    ordersByStatus[order.status] = [...currentStatusOrders, order.id];
    purchaseStore.ordersByStatus.set(ordersByStatus);

    // Update vendor indexes
    const ordersByVendor = purchaseStore.ordersByVendor.peek() ?? {};
    const currentVendorOrders = ordersByVendor[order.vendorId] ?? [];
    ordersByVendor[order.vendorId] = [...currentVendorOrders, order.id];
    purchaseStore.ordersByVendor.set(ordersByVendor);
  },

  updateOrder: (id: string, updates: Partial<PurchaseOrder>) => {
    const items = purchaseStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      const updated = { ...current, ...updates };
      purchaseStore.items.set({ ...items, [id]: updated });

      // Update status indexes if status changed
      if (updates.status && updates.status !== current.status) {
        const ordersByStatus = purchaseStore.ordersByStatus.peek() ?? {};
        const currentStatusOrders = ordersByStatus[current.status] ?? [];
        const newStatusOrders = ordersByStatus[updates.status] ?? [];

        ordersByStatus[current.status] = currentStatusOrders.filter(
          (orderId) => orderId !== id,
        );
        ordersByStatus[updates.status] = [...newStatusOrders, id];
        purchaseStore.ordersByStatus.set(ordersByStatus);
      }

      // Update vendor indexes if vendor changed
      if (updates.vendorId && updates.vendorId !== current.vendorId) {
        const ordersByVendor = purchaseStore.ordersByVendor.peek() ?? {};
        const currentVendorOrders = ordersByVendor[current.vendorId] ?? [];
        const newVendorOrders = ordersByVendor[updates.vendorId] ?? [];

        ordersByVendor[current.vendorId] = currentVendorOrders.filter(
          (orderId) => orderId !== id,
        );
        ordersByVendor[updates.vendorId] = [...newVendorOrders, id];
        purchaseStore.ordersByVendor.set(ordersByVendor);
      }
    }
  },

  deleteOrder: (id: string) => {
    const items = purchaseStore.items.peek() ?? {};
    const order = items[id];
    if (order) {
      // Remove from main items
      delete items[id];
      purchaseStore.items.set(items);

      // Remove from status indexes
      const ordersByStatus = purchaseStore.ordersByStatus.peek() ?? {};
      const currentStatusOrders = ordersByStatus[order.status] ?? [];
      ordersByStatus[order.status] = currentStatusOrders.filter(
        (orderId) => orderId !== id,
      );
      purchaseStore.ordersByStatus.set(ordersByStatus);

      // Remove from vendor indexes
      const ordersByVendor = purchaseStore.ordersByVendor.peek() ?? {};
      const currentVendorOrders = ordersByVendor[order.vendorId] ?? [];
      ordersByVendor[order.vendorId] = currentVendorOrders.filter(
        (orderId) => orderId !== id,
      );
      purchaseStore.ordersByVendor.set(ordersByVendor);
    }
  },

  receiveItems: (
    id: string,
    receivedItems: Array<{ id: string; quantity: number }>,
  ) => {
    const items = purchaseStore.items.peek() ?? {};
    const order = items[id];
    if (order) {
      const updatedItems = order.items.map((item) => {
        const received = receivedItems.find((ri) => ri.id === item.productId);
        if (received) {
          return {
            ...item,
            receivedQuantity: Math.min(
              item.quantity,
              (item.receivedQuantity || 0) + received.quantity,
            ),
          };
        }
        return item;
      });

      const allReceived = updatedItems.every(
        (item) => item.receivedQuantity === item.quantity,
      );
      const anyReceived = updatedItems.some(
        (item) => item.receivedQuantity > 0,
      );
      const newStatus = allReceived
        ? "received"
        : anyReceived
          ? "partial"
          : order.status;

      purchaseActions.updateOrder(id, {
        items: updatedItems,
        status: newStatus,
        receivingDetails: {
          receivedAt: new Date().toISOString(),
          receivedBy: "current-user", // TODO: Replace with actual user
          locationId: "default-location", // TODO: Replace with actual location
          notes: "Items received",
        },
      });
    }
  },
};
