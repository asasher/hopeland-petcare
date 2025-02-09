import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { Customer, CustomerStatus } from "../types/customer";
import type { Address } from "../types/common";

// Customer specific state
type CustomerState = BaseState<Customer> & {
  customersByStatus: Record<CustomerStatus, string[]>;
  totalCustomers: number;
  activeCustomers: number;
  totalReceivables: number;
  defaultAddresses: Record<string, Address>;
};

// Initialize state
const initialState: Partial<CustomerState> = {
  items: {},
  customersByStatus: {} as Record<CustomerStatus, string[]>,
  totalCustomers: 0,
  activeCustomers: 0,
  totalReceivables: 0,
  defaultAddresses: {},
};

// Create the store with type
export const customerStore = createDomainStore<Customer>(
  "customers",
  initialState,
) as unknown as Observable<CustomerState>;

// Computed values
export const activeCustomers = computed(() => {
  const customers = Object.values(
    customerStore.items.peek() || {},
  ) as Customer[];
  return customers.filter((customer) => customer.status === "active");
});

export const customersByStatus = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers.reduce(
    (acc, customer) => {
      const status = customer.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(customer.id);
      return acc;
    },
    {} as Record<CustomerStatus, string[]>,
  );
});

export const defaultAddresses = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers.reduce(
    (acc, customer) => {
      const defaultAddress = customer.addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        acc[customer.id] = defaultAddress;
      }
      return acc;
    },
    {} as Record<string, Address>,
  );
});

export const customerMetrics = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers.reduce(
    (metrics, customer) => {
      metrics.total++;
      if (customer.status === "active") {
        metrics.active++;
      }
      metrics.totalReceivables += customer.balance;
      return metrics;
    },
    { total: 0, active: 0, totalReceivables: 0 },
  );
});

export const recentCustomers = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);
});

export const customersByBalance = computed(() => {
  const customers = Object.values(customerStore.items.peek() ?? {});
  return customers
    .filter((customer) => customer.balance > 0)
    .sort((a, b) => b.balance - a.balance);
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
    delete items[id];
    customerStore.items.set(items);
  },

  updateStatus: (id: string, status: CustomerStatus) => {
    const items = customerStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      customerStore.items.set({
        ...items,
        [id]: { ...current, status },
      });
    }
  },

  updateDefaultAddress: (id: string, address: Address) => {
    const addresses = customerStore.defaultAddresses.peek() ?? {};
    customerStore.defaultAddresses.set({
      ...addresses,
      [id]: address,
    });
  },

  updateBalance: (id: string, amount: number) => {
    const items = customerStore.items.peek() ?? {};
    const customer = items[id];
    if (customer) {
      customerActions.updateCustomer(id, {
        balance: customer.balance + amount,
      });
    }
  },

  updateCreditLimit: (id: string, limit: number) => {
    const items = customerStore.items.peek() ?? {};
    const customer = items[id];
    if (customer) {
      customerActions.updateCustomer(id, {
        creditLimit: limit,
      });
    }
  },

  addAddress: (id: string, address: Address) => {
    const items = customerStore.items.peek() ?? {};
    const customer = items[id];
    if (customer) {
      const addresses = [...customer.addresses];
      if (address.isDefault) {
        // Remove default flag from other addresses
        addresses.forEach((addr) => (addr.isDefault = false));
      }
      addresses.push(address);
      customerActions.updateCustomer(id, { addresses });
    }
  },

  updateAddress: (
    id: string,
    addressIndex: number,
    updates: Partial<Omit<Address, "type">> & { type?: Address["type"] },
  ) => {
    const items = customerStore.items.peek() ?? {};
    const customer = items[id];
    if (customer?.addresses[addressIndex]) {
      const addresses = [...customer.addresses];
      if (updates.isDefault) {
        // Remove default flag from other addresses
        addresses.forEach((addr) => (addr.isDefault = false));
      }
      addresses[addressIndex] = {
        ...addresses[addressIndex],
        ...updates,
      } as Address;
      customerActions.updateCustomer(id, { addresses });
    }
  },

  removeAddress: (id: string, addressIndex: number) => {
    const items = customerStore.items.peek() ?? {};
    const customer = items[id];
    if (customer?.addresses[addressIndex]) {
      const addresses = customer.addresses.filter(
        (_, index) => index !== addressIndex,
      );
      customerActions.updateCustomer(id, { addresses });
    }
  },
};
