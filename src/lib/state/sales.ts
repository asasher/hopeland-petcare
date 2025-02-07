import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type {
  SalesOrder,
  SalesOrderStatus,
  PaymentStatus,
} from "../types/sales";

// Sales specific state
type SalesState = BaseState<SalesOrder> & {
  ordersByStatus: Record<SalesOrderStatus, string[]>;
  ordersByPaymentStatus: Record<PaymentStatus, string[]>;
  totalRevenue: number;
  unpaidAmount: number;
};

// Initialize state
const initialState: Partial<SalesState> = {
  items: {},
  ordersByStatus: {
    draft: [],
    confirmed: [],
    processing: [],
    shipped: [],
    delivered: [],
    cancelled: [],
    returned: [],
  },
  ordersByPaymentStatus: {
    pending: [],
    partial: [],
    paid: [],
    refunded: [],
    void: [],
  },
  totalRevenue: 0,
  unpaidAmount: 0,
};

// Create the store with type
export const salesStore = createDomainStore<SalesOrder>(
  "sales",
  initialState,
) as unknown as Observable<SalesState>;

// Computed values
export const ordersByStatus = computed(() => {
  const orders = Object.values(salesStore.items.peek() || {});
  return orders.reduce(
    (acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = [];
      }
      acc[order.status].push(order.id);
      return acc;
    },
    {} as Record<SalesOrderStatus, string[]>,
  );
});

export const ordersByPaymentStatus = computed(() => {
  const orders = Object.values(salesStore.items.peek() || {});
  return orders.reduce(
    (acc, order) => {
      if (!acc[order.paymentStatus]) {
        acc[order.paymentStatus] = [];
      }
      acc[order.paymentStatus].push(order.id);
      return acc;
    },
    {} as Record<PaymentStatus, string[]>,
  );
});

export const totalRevenue = computed(() => {
  const orders = Object.values(salesStore.items.peek() || {});
  return orders.reduce((total, order) => {
    if (order.paymentStatus === "paid" || order.paymentStatus === "partial") {
      return total + order.total;
    }
    return total;
  }, 0);
});

export const unpaidAmount = computed(() => {
  const orders = Object.values(salesStore.items.peek() || {});
  return orders.reduce((total, order) => {
    if (
      order.paymentStatus === "pending" ||
      order.paymentStatus === "partial"
    ) {
      return total + (order.total - (order.paymentDetails?.amount || 0));
    }
    return total;
  }, 0);
});

export const recentOrders = computed(() => {
  const orders = Object.values(salesStore.items.peek() || {});
  return orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);
});

// Actions
export const salesActions = {
  addOrder: (order: SalesOrder) => {
    const items = salesStore.items.peek() || {};
    salesStore.items.set({ ...items, [order.id]: order });

    // Update order status indexes
    const ordersByStatus = salesStore.ordersByStatus.peek() || {};
    ordersByStatus[order.status] = [
      ...(ordersByStatus[order.status] || []),
      order.id,
    ];
    salesStore.ordersByStatus.set(ordersByStatus);

    // Update payment status indexes
    const ordersByPaymentStatus = salesStore.ordersByPaymentStatus.peek() || {};
    ordersByPaymentStatus[order.paymentStatus] = [
      ...(ordersByPaymentStatus[order.paymentStatus] || []),
      order.id,
    ];
    salesStore.ordersByPaymentStatus.set(ordersByPaymentStatus);
  },

  updateOrder: (id: string, updates: Partial<SalesOrder>) => {
    const items = salesStore.items.peek() || {};
    const current = items[id];
    if (current) {
      const updated = { ...current, ...updates };
      salesStore.items.set({ ...items, [id]: updated });

      // Update status indexes if status changed
      if (updates.status && updates.status !== current.status) {
        const ordersByStatus = salesStore.ordersByStatus.peek() || {};
        ordersByStatus[current.status] = ordersByStatus[current.status].filter(
          (orderId) => orderId !== id,
        );
        ordersByStatus[updates.status] = [
          ...(ordersByStatus[updates.status] || []),
          id,
        ];
        salesStore.ordersByStatus.set(ordersByStatus);
      }

      // Update payment status indexes if payment status changed
      if (
        updates.paymentStatus &&
        updates.paymentStatus !== current.paymentStatus
      ) {
        const ordersByPaymentStatus =
          salesStore.ordersByPaymentStatus.peek() || {};
        ordersByPaymentStatus[current.paymentStatus] = ordersByPaymentStatus[
          current.paymentStatus
        ].filter((orderId) => orderId !== id);
        ordersByPaymentStatus[updates.paymentStatus] = [
          ...(ordersByPaymentStatus[updates.paymentStatus] || []),
          id,
        ];
        salesStore.ordersByPaymentStatus.set(ordersByPaymentStatus);
      }
    }
  },

  deleteOrder: (id: string) => {
    const items = salesStore.items.peek() || {};
    const order = items[id];
    if (order) {
      // Remove from main items
      delete items[id];
      salesStore.items.set(items);

      // Remove from status indexes
      const ordersByStatus = salesStore.ordersByStatus.peek() || {};
      ordersByStatus[order.status] = ordersByStatus[order.status].filter(
        (orderId) => orderId !== id,
      );
      salesStore.ordersByStatus.set(ordersByStatus);

      // Remove from payment status indexes
      const ordersByPaymentStatus =
        salesStore.ordersByPaymentStatus.peek() || {};
      ordersByPaymentStatus[order.paymentStatus] = ordersByPaymentStatus[
        order.paymentStatus
      ].filter((orderId) => orderId !== id);
      salesStore.ordersByPaymentStatus.set(ordersByPaymentStatus);
    }
  },
};
