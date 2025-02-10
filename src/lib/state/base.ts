import { observable } from "@legendapp/state";
import { configureSynced } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { persistObservable } from "@legendapp/state/persist";
import type { Customer } from "../types/customer";
import type { Vendor } from "../types/vendor";
import type { Product } from "../types/product";
import type { SalesOrder } from "../types/sales";
import type { PurchaseOrder } from "../types/purchase";
import type { Account } from "../types/accounting";

// Common state types
export type LoadingState = {
  loading: boolean;
  error: string | null;
};

export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};

export type FilterState = {
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters: Record<string, unknown>;
};

// Base state type for all domains
export type BaseState<T> = {
  items: Record<string, T>;
};

// Configure persistence
export const configurePersistence = configureSynced({
  persist: {
    plugin: ObservablePersistLocalStorage,
  },
});

// Mock data generator utilities
const generateId = () => crypto.randomUUID();
const generateDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock initial data
export const mockCustomers: Record<string, Customer> = {
  [generateId()]: {
    id: generateId(),
    name: "John's Pet Shop",
    isActive: true,
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA",
    },
    contacts: [
      {
        contactType: "email" as const,
        name: "John Doe",
        email: "john@petshop.com",
        role: "Owner",
      },
      {
        contactType: "phone" as const,
        name: "Jane Doe",
        phone: "415-555-0123",
        role: "Manager",
      },
    ],
    notes: "Regular customer since 2020",
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
};

export const mockVendors: Record<string, Vendor> = {
  [generateId()]: {
    id: generateId(),
    name: "Pet Supplies Co",
    isActive: true,
    address: {
      street: "456 Market St",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90012",
      country: "USA",
    },
    contacts: [
      {
        contactType: "email" as const,
        name: "Bob Smith",
        email: "bob@petsupplies.com",
        role: "Sales Rep",
      },
    ],
    notes: "Premium supplier",
    leadTime: 3,
    createdAt: generateDate(180),
    updatedAt: generateDate(7),
  },
};

export const mockProducts: Record<string, Product> = {
  [generateId()]: {
    id: generateId(),
    name: "Premium Dog Food",
    description: "High-quality dog food for all breeds",
    isActive: true,
    notes: "Best seller",
    createdAt: generateDate(90),
    updatedAt: generateDate(1),
  },
};

export const mockSalesOrders: Record<string, SalesOrder> = {
  [generateId()]: {
    id: generateId(),
    orderNumber: "SO-001",
    customerId: Object.keys(mockCustomers)[0],
    status: "confirmed",
    paymentStatus: "paid",
    items: [
      {
        productId: Object.keys(mockProducts)[0],
        variantId: "default",
        quantity: 5,
        unitPrice: 49.99,
        discount: 0,
        tax: 4.99,
        total: 274.94,
      },
    ],
    subtotal: 249.95,
    tax: 24.99,
    shipping: 15,
    discount: 0,
    total: 289.94,
    shippingDetails: {
      address: mockCustomers[Object.keys(mockCustomers)[0]].address.street,
      city: mockCustomers[Object.keys(mockCustomers)[0]].address.city,
      state: mockCustomers[Object.keys(mockCustomers)[0]].address.state,
      country: mockCustomers[Object.keys(mockCustomers)[0]].address.country,
      postalCode:
        mockCustomers[Object.keys(mockCustomers)[0]].address.postalCode,
      phone: "415-555-0123",
      carrier: "FedEx",
      estimatedDelivery: generateDate(-7),
    },
    paymentDetails: {
      method: "credit-card",
      transactionId: "txn_123456",
      amount: 289.94,
      currency: "USD",
      paidAt: generateDate(0),
    },
    createdAt: generateDate(14),
    updatedAt: generateDate(0),
  },
};

export const mockPurchaseOrders: Record<string, PurchaseOrder> = {
  [generateId()]: {
    id: generateId(),
    orderNumber: "PO-001",
    vendorId: Object.keys(mockVendors)[0],
    status: "received",
    items: [
      {
        productId: Object.keys(mockProducts)[0],
        variantId: "default",
        quantity: 100,
        unitPrice: 29.99,
        tax: 299.9,
        total: 3298.9,
        receivedQuantity: 100,
      },
    ],
    subtotal: 2999.0,
    tax: 299.9,
    total: 3298.9,
    expectedDeliveryDate: generateDate(-7),
    receivingDetails: {
      receivedAt: generateDate(0),
      receivedBy: "Jane Doe",
      locationId: "main-warehouse",
      notes: "All items received in good condition",
    },
    createdAt: generateDate(14),
    updatedAt: generateDate(0),
  },
};

export const mockAccounts: Record<string, Account> = {
  [generateId()]: {
    id: generateId(),
    code: "1000",
    name: "Cash",
    type: "asset",
    category: "current-asset",
    description: "Cash on hand",
    isActive: true,
    balance: 50000,
    tags: ["cash", "current-asset"],
    createdAt: generateDate(365),
    updatedAt: generateDate(0),
  },
  [generateId()]: {
    id: generateId(),
    code: "4000",
    name: "Sales Revenue",
    type: "revenue",
    category: "operating-revenue",
    description: "Revenue from sales",
    isActive: true,
    balance: 150000,
    tags: ["revenue", "sales"],
    createdAt: generateDate(365),
    updatedAt: generateDate(0),
  },
};

// Create domain store
export function createDomainStore<T>(
  name: string,
  initialState: Partial<BaseState<T>>,
) {
  const store = observable({
    items: {} as Record<string, T>,
    ...initialState,
  });

  return store;
}

// Helper to initialize store with mock data
export function initializeStoreWithMockData<T>(
  store: {
    items: {
      get: () => Record<string, T>;
      set: (data: Record<string, T>) => void;
    };
  },
  mockData: Record<string, T>,
) {
  const currentData = store.items.get();
  if (Object.keys(currentData).length === 0) {
    store.items.set(mockData);
  }
}
