import { observable } from "@legendapp/state";

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

// Initialize the root state
const initialState: RootState = {
  products: { items: {}, loading: false, error: null },
  sales: { orders: {}, loading: false, error: null },
  purchases: { orders: {}, loading: false, error: null },
  customers: { items: {}, loading: false, error: null },
  vendors: { items: {}, loading: false, error: null },
  accounting: { accounts: {}, loading: false, error: null },
  inventory: { items: {}, loading: false, error: null },
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
