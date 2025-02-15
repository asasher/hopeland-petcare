import { observable } from "@legendapp/state";

// Domain state types
export type DomainState<T> = {
  items: Record<string, T>;
};

// Store configuration
const store = observable({
  customers: {
    items: {},
  },
  vendors: {
    items: {},
  },
  products: {
    items: {},
  },
  sales: {
    items: {},
  },
  purchases: {
    items: {},
  },
  inventory: {
    items: {},
  },
});

// Export store and domain slices
export const { customers, vendors, products, sales, purchases, inventory } =
  store;
