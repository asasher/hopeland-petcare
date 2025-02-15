import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { InventoryAdjustment, InventoryItem } from "../types/inventory";
import { mockInventoryItems } from "./mock-data";

// Inventory specific state
export type InventoryState = BaseState<InventoryItem> & {
  adjustments: Record<string, InventoryAdjustment>;
};

// Initialize state
const initialState: Partial<BaseState<InventoryItem>> &
  Pick<InventoryState, "adjustments"> = {
  items: mockInventoryItems,
  adjustments: {},
};

// Create the store with type
export const inventoryStore = createDomainStore<InventoryItem>(
  "inventory",
  initialState,
) as unknown as Observable<InventoryState>;

// Computed values
export const inventoryMetrics = {
  totalItems: computed(() => {
    const items = inventoryStore.items.peek() ?? {};
    return Object.values(items).reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }),
  lowStockItems: computed(() => {
    const items = inventoryStore.items.peek() ?? {};
    return Object.values(items).filter((item) => item.quantity < 10);
  }),
};

// Actions
export const inventoryActions = {
  addAdjustment: (adjustment: InventoryAdjustment) => {
    // Add adjustment to history
    const adjustments = inventoryStore.adjustments.peek() ?? {};
    inventoryStore.adjustments.set({
      ...adjustments,
      [adjustment.id]: adjustment,
    });

    // Update inventory quantity
    const items = inventoryStore.items.peek() ?? {};
    const item = items[adjustment.productId];
    if (item) {
      inventoryStore.items.set({
        ...items,
        [adjustment.productId]: {
          ...item,
          quantity: item.quantity + adjustment.quantity,
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      // Create new inventory item if it doesn't exist
      inventoryStore.items.set({
        ...items,
        [adjustment.productId]: {
          id: adjustment.productId,
          productId: adjustment.productId,
          quantity: adjustment.quantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },
};
