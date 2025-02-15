import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { SalesOrder, SalesOrderStatus } from "../types/sales";
import { mockSalesOrders } from "./mock-data";

// Sales specific state
type SalesState = BaseState<SalesOrder> & {
  ordersByStatus: Record<SalesOrderStatus, string[]>;
  totalRevenue: number;
  unpaidAmount: number;
};

// Initialize state
const initialState: Partial<SalesState> = {
  items: mockSalesOrders,
  ordersByStatus: {
    draft: [],
    confirmed: [],
    shipped: [],
    delivered: [],
    cancelled: [],
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
export const salesMetrics = computed(() => {
  const orders = Object.values(salesStore.items.peek() ?? {});
  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    paidRevenue: orders.reduce(
      (sum, order) => (order.isPaid ? sum + order.total : sum),
      0,
    ),
    unpaidRevenue: orders.reduce(
      (sum, order) => (!order.isPaid ? sum + order.total : sum),
      0,
    ),
    ordersByStatus: orders.reduce(
      (acc, order) => {
        if (!acc[order.status]) {
          acc[order.status] = [];
        }
        acc[order.status].push(order.id);
        return acc;
      },
      {} as Record<SalesOrderStatus, string[]>,
    ),
  };
});

// Actions
export const salesActions = {
  addOrder: (order: SalesOrder) => {
    const items = salesStore.items.peek() ?? {};
    salesStore.items.set({ ...items, [order.id]: order });
  },

  updateOrder: (id: string, updates: Partial<SalesOrder>) => {
    const items = salesStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      const updated = { ...current, ...updates };
      salesStore.items.set({ ...items, [id]: updated });
    }
  },

  deleteOrder: (id: string) => {
    const items = salesStore.items.peek() ?? {};
    const newItems = { ...items };
    delete newItems[id];
    salesStore.items.set(newItems);
  },
};
