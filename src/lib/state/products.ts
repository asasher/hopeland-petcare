import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { Product, ProductCategory } from "../types/product";

// Product specific state
type ProductState = BaseState<Product> & {
  categories: Record<string, ProductCategory>;
  activeOnly: boolean;
  lowStock: boolean;
};

// Initialize state
const initialState: Partial<ProductState> = {
  items: {},
  categories: {},
  activeOnly: true,
  lowStock: false,
};

// Create the store with type
export const productStore = createDomainStore<Product>(
  "products",
  initialState,
) as unknown as Observable<ProductState>;

// Computed values
export const activeProducts = computed(() => {
  const products = Object.values(productStore.items.peek() || {});
  return products.filter((product) => product.isActive);
});

export const lowStockProducts = computed(() => {
  const products = Object.values(productStore.items.peek() || {});
  return products.filter((product) => {
    return product.variants.some(
      (variant) => variant.stockQuantity <= variant.reorderPoint,
    );
  });
});

export const productsByCategory = computed(() => {
  const products = Object.values(productStore.items.peek() || {});
  const categories = productStore.categories.peek() || {};

  return Object.values(categories).reduce(
    (acc, category) => {
      acc[category.id] = products.filter(
        (product) => product.categoryId === category.id,
      );
      return acc;
    },
    {} as Record<string, Product[]>,
  );
});

// Actions
export const productActions = {
  setActiveOnly: (value: boolean) => {
    productStore.activeOnly.set(value);
  },

  setLowStock: (value: boolean) => {
    productStore.lowStock.set(value);
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

  addCategory: (category: ProductCategory) => {
    const categories = productStore.categories.peek() || {};
    productStore.categories.set({
      ...categories,
      [category.id]: category,
    });
  },

  updateCategory: (id: string, updates: Partial<ProductCategory>) => {
    const categories = productStore.categories.peek() || {};
    const current = categories[id];
    if (current) {
      productStore.categories.set({
        ...categories,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteCategory: (id: string) => {
    const categories = productStore.categories.peek() || {};
    delete categories[id];
    productStore.categories.set(categories);
  },
};
