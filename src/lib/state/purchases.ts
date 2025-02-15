import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { PurchaseOrder, PurchaseOrderStatus } from "../types/purchase";
import { mockPurchaseOrders } from "./mock-data";

// Purchase specific state
type PurchaseState = BaseState<PurchaseOrder> & {
  totalOrders: number;
  totalValue: number;
  ordersByStatus: Record<PurchaseOrderStatus, PurchaseOrder[]>;
};

// Initialize state
const initialState: Partial<PurchaseState> = {
  items: mockPurchaseOrders,
  totalOrders: 0,
  totalValue: 0,
  ordersByStatus: {
    draft: [],
    ordered: [],
    received: [],
    cancelled: [],
  },
};

// Create the store with type
export const purchaseStore = createDomainStore<PurchaseOrder>(
  "purchases",
  initialState,
) as unknown as Observable<PurchaseState>;

// Computed values
export const purchaseMetrics = computed(() => {
  const orders = Object.values(purchaseStore.items.peek() ?? {});
  return {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue:
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
        : 0,
    ordersByStatus: orders.reduce(
      (acc, order) => {
        if (!acc[order.status]) {
          acc[order.status] = [];
        }
        acc[order.status].push(order);
        return acc;
      },
      {} as Record<PurchaseOrderStatus, PurchaseOrder[]>,
    ),
  };
});

// Actions
export const purchaseActions = {
  addOrder: (order: PurchaseOrder) => {
    const items = purchaseStore.items.peek() ?? {};
    purchaseStore.items.set({ ...items, [order.id]: order });
  },

  updateOrder: (id: string, updates: Partial<PurchaseOrder>) => {
    const items = purchaseStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      purchaseStore.items.set({
        ...items,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteOrder: (id: string) => {
    const items = purchaseStore.items.peek() ?? {};
    const newItems = { ...items };
    delete newItems[id];
    purchaseStore.items.set(newItems);
  },
};
