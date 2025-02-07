import { observable } from "@legendapp/state";
import { configureSynced, synced } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

// Define the root state type
export type RootState = {
  products: {
    items: Record<string, unknown>; // Will be replaced with proper Product type
    loading: boolean;
    error: string | null;
  };
  sales: {
    orders: Record<string, unknown>; // Will be replaced with proper SalesOrder type
    loading: boolean;
    error: string | null;
  };
  purchases: {
    orders: Record<string, unknown>; // Will be replaced with proper PurchaseOrder type
    loading: boolean;
    error: string | null;
  };
  customers: {
    items: Record<string, unknown>; // Will be replaced with proper Customer type
    loading: boolean;
    error: string | null;
  };
  vendors: {
    items: Record<string, unknown>; // Will be replaced with proper Vendor type
    loading: boolean;
    error: string | null;
  };
  accounting: {
    accounts: Record<string, unknown>; // Will be replaced with proper Account type
    loading: boolean;
    error: string | null;
  };
  inventory: {
    items: Record<string, unknown>; // Will be replaced with proper Inventory type
    loading: boolean;
    error: string | null;
  };
};

// Define common state structure for all domains
type DomainState<T> = {
  loading: boolean;
  error: string | null;
} & T;

// Define specific domain states
export type ProductsState = DomainState<{ items: Record<string, unknown> }>;
export type SalesState = DomainState<{ orders: Record<string, unknown> }>;
export type PurchasesState = DomainState<{ orders: Record<string, unknown> }>;
export type CustomersState = DomainState<{ items: Record<string, unknown> }>;
export type VendorsState = DomainState<{ items: Record<string, unknown> }>;
export type AccountingState = DomainState<{
  accounts: Record<string, unknown>;
}>;
export type InventoryState = DomainState<{ items: Record<string, unknown> }>;

// Setup persistence configuration
const mySynced = configureSynced(synced, {
  persist: {
    plugin: ObservablePersistLocalStorage,
  },
});

// Initialize the root state with persistence
const initialState: RootState = {
  products: mySynced({
    initial: { items: {}, loading: false, error: null },
    persist: { name: "products" },
  }),
  sales: mySynced({
    initial: { orders: {}, loading: false, error: null },
    persist: { name: "sales" },
  }),
  purchases: mySynced({
    initial: { orders: {}, loading: false, error: null },
    persist: { name: "purchases" },
  }),
  customers: mySynced({
    initial: { items: {}, loading: false, error: null },
    persist: { name: "customers" },
  }),
  vendors: mySynced({
    initial: { items: {}, loading: false, error: null },
    persist: { name: "vendors" },
  }),
  accounting: mySynced({
    initial: { accounts: {}, loading: false, error: null },
    persist: { name: "accounting" },
  }),
  inventory: mySynced({
    initial: { items: {}, loading: false, error: null },
    persist: { name: "inventory" },
  }),
};

// Create the store
export const store = observable(initialState);

// Export selectors for each domain
export const products = store.products;
export const sales = store.sales;
export const purchases = store.purchases;
export const customers = store.customers;
export const vendors = store.vendors;
export const accounting = store.accounting;
export const inventory = store.inventory;
