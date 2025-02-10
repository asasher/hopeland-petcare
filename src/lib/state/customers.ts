import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { Customer } from "../types/customer";
import { mockCustomers } from "./mock-data";

// Customer specific state
type CustomerState = BaseState<Customer>;

// Initialize state
const initialState: Partial<CustomerState> = {
  items: mockCustomers,
};

// Create the store with type
export const customerStore = createDomainStore<Customer>(
  "customers",
  initialState,
) as unknown as Observable<CustomerState>;

// Computed values
export const activeCustomers = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers.filter((customer) => customer.isActive);
});

export const customerMetrics = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers.reduce(
    (metrics, customer) => {
      metrics.total++;
      if (customer.isActive) {
        metrics.active++;
      }
      return metrics;
    },
    { total: 0, active: 0 },
  );
});

export const recentCustomers = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return [...customers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);
});

// Actions
export const customerActions = {
  addCustomer: (customer: Customer) => {
    const items = customerStore.items.peek() ?? {};
    customerStore.items.set({ ...items, [customer.id]: customer });
  },

  updateCustomer: (id: string, updates: Partial<Customer>) => {
    const items = customerStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      customerStore.items.set({
        ...items,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteCustomer: (id: string) => {
    const items = customerStore.items.peek() ?? {};
    const newItems = { ...items };
    delete newItems[id];
    customerStore.items.set(newItems);
  },

  updateActive: (id: string, isActive: boolean) => {
    const items = customerStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      customerStore.items.set({
        ...items,
        [id]: { ...current, isActive },
      });
    }
  },
};
