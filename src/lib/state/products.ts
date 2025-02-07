import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { Product } from "@/lib/types/product";

// Product specific state
type ProductState = BaseState<Product> & {
  activeOnly: boolean;
};

// Initialize state
const initialState: Partial<ProductState> = {
  items: {},
  activeOnly: true,
};

// Create the store with type
export const productStore = createDomainStore<Product>(
  "products",
  initialState,
) as unknown as Observable<ProductState>;

// Computed values
export const activeProducts = computed(() => {
  const products = Object.values(productStore.items.peek() || {}) as Product[];
  return products.filter((product) => product.isActive);
});

// Actions
export const productActions = {
  setActiveOnly: (value: boolean) => {
    productStore.activeOnly.set(value);
  },

  addProduct: (product: Product) => {
    const items = productStore.items.peek() || {};
    productStore.items.set({ ...items, [product.id]: product });
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    const items = productStore.items.peek() || {};
    const current = items[id];
    if (current) {
      productStore.items.set({
        ...items,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteProduct: (id: string) => {
    const items = productStore.items.peek() || {};
    delete items[id];
    productStore.items.set(items);
  },
};
