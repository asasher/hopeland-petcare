import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type {
  Location,
  StockLevel,
  InventoryTransaction,
  InventoryAdjustment,
  InventoryTransactionType,
} from "../types/inventory";

// Inventory specific state
type InventoryState = BaseState<StockLevel> & {
  locations: Record<string, Location>;
  stockLevels: Record<string, StockLevel>;
  transactions: Record<string, InventoryTransaction>;
  adjustments: Record<string, InventoryAdjustment>;
  stockByLocation: Record<string, Record<string, StockLevel>>;
  lowStockItems: string[];
  totalValue: number;
  reorderItems: string[];
};

// Initialize state
const initialState: Partial<InventoryState> = {
  items: {},
  locations: {},
  stockLevels: {},
  transactions: {},
  adjustments: {},
  stockByLocation: {},
  lowStockItems: [],
  totalValue: 0,
  reorderItems: [],
};

// Create the store with type
export const inventoryStore = createDomainStore<StockLevel>(
  "inventory",
  initialState,
) as unknown as Observable<InventoryState>;

// Computed values
export const stockByLocation = computed(() => {
  const stockLevels = Object.values(
    inventoryStore.stockLevels.peek() ?? {},
  ).filter((stock): stock is StockLevel => !!stock);

  return stockLevels.reduce(
    (acc, stock) => {
      const locationId = stock?.locationId;
      if (locationId) {
        if (!acc[locationId]) {
          acc[locationId] = {};
        }
        const key = `${stock.productId}-${stock.variantId}`;
        acc[locationId][key] = stock;
      }
      return acc;
    },
    {} as Record<string, Record<string, StockLevel>>,
  );
});

export const lowStockItems = computed(() => {
  const stockLevels = Object.values(inventoryStore.stockLevels.peek() ?? {});
  return stockLevels
    .filter((stock) => stock.quantity <= stock.reorderPoint)
    .map((stock) => `${stock.productId}-${stock.variantId}`);
});

export const reorderItems = computed(() => {
  const stockLevels = Object.values(inventoryStore.stockLevels.peek() ?? {});
  return stockLevels
    .filter(
      (stock) =>
        stock.quantity <= stock.reorderPoint &&
        stock.quantity + stock.reservedQuantity < stock.reorderQuantity,
    )
    .map((stock) => `${stock.productId}-${stock.variantId}`);
});

export const totalValue = computed(() => {
  const transactions = Object.values(inventoryStore.transactions.peek() ?? {});
  return transactions.reduce((total, transaction) => {
    switch (transaction.type) {
      case "purchase":
      case "transfer":
        return total + transaction.totalCost;
      case "sale":
      case "return":
        return total - transaction.totalCost;
      default:
        return total;
    }
  }, 0);
});

export const stockMovement = computed(() => {
  const transactions = Object.values(inventoryStore.transactions.peek() ?? {});
  const movement: Record<
    InventoryTransactionType,
    { quantity: number; value: number }
  > = {
    purchase: { quantity: 0, value: 0 },
    sale: { quantity: 0, value: 0 },
    return: { quantity: 0, value: 0 },
    adjustment: { quantity: 0, value: 0 },
    transfer: { quantity: 0, value: 0 },
  };

  transactions.forEach((transaction) => {
    movement[transaction.type].quantity += transaction.quantity;
    movement[transaction.type].value += transaction.totalCost;
  });

  return movement;
});

// Actions
export const inventoryActions = {
  addLocation: (location: Location) => {
    const locations = inventoryStore.locations.peek() ?? {};
    inventoryStore.locations.set({ ...locations, [location.id]: location });

    // Initialize stock by location index
    const stockByLocation = inventoryStore.stockByLocation.peek() ?? {};
    stockByLocation[location.id] = {};
    inventoryStore.stockByLocation.set(stockByLocation);
  },

  updateLocation: (id: string, updates: Partial<Location>) => {
    const locations = inventoryStore.locations.peek() ?? {};
    const current = locations[id];
    if (current) {
      inventoryStore.locations.set({
        ...locations,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteLocation: (id: string) => {
    const locations = inventoryStore.locations.peek() ?? {};
    delete locations[id];
    inventoryStore.locations.set(locations);

    // Clean up stock by location index
    const stockByLocation = inventoryStore.stockByLocation.peek() ?? {};
    delete stockByLocation[id];
    inventoryStore.stockByLocation.set(stockByLocation);
  },

  updateStockLevel: (
    productId: string,
    variantId: string,
    locationId: string,
    updates: Partial<StockLevel>,
  ) => {
    const stockLevels = inventoryStore.stockLevels.peek() ?? {};
    const key = `${productId}-${variantId}-${locationId}`;
    const current = stockLevels[key];

    if (current) {
      const updated = { ...current, ...updates };
      inventoryStore.stockLevels.set({ ...stockLevels, [key]: updated });

      // Update stock by location index
      const stockByLocation = inventoryStore.stockByLocation.peek() ?? {};
      if (!stockByLocation[locationId]) {
        stockByLocation[locationId] = {};
      }
      const productKey = `${productId}-${variantId}`;
      stockByLocation[locationId][productKey] = updated;
      inventoryStore.stockByLocation.set(stockByLocation);

      // Update low stock items
      if (updated.quantity <= updated.reorderPoint) {
        const lowStockItems = inventoryStore.lowStockItems.peek() ?? [];
        if (!lowStockItems.includes(productKey)) {
          inventoryStore.lowStockItems.set([...lowStockItems, productKey]);
        }
      }

      // Update reorder items
      if (
        updated.quantity <= updated.reorderPoint &&
        updated.quantity + updated.reservedQuantity < updated.reorderQuantity
      ) {
        const reorderItems = inventoryStore.reorderItems.peek() ?? [];
        if (!reorderItems.includes(productKey)) {
          inventoryStore.reorderItems.set([...reorderItems, productKey]);
        }
      }
    }
  },

  addTransaction: (transaction: InventoryTransaction) => {
    const transactions = inventoryStore.transactions.peek() ?? {};
    inventoryStore.transactions.set({
      ...transactions,
      [transaction.id]: transaction,
    });

    // Update stock levels
    const stockLevels = inventoryStore.stockLevels.peek() ?? {};
    const key = `${transaction.productId}-${transaction.variantId}-${transaction.toLocationId}`;
    const current = stockLevels[key];

    if (current) {
      let quantityChange = 0;
      switch (transaction.type) {
        case "purchase":
        case "return":
          quantityChange = transaction.quantity;
          break;
        case "sale":
          quantityChange = -transaction.quantity;
          break;
        case "transfer":
          // Handle from location
          if (transaction.fromLocationId) {
            const fromKey = `${transaction.productId}-${transaction.variantId}-${transaction.fromLocationId}`;
            const fromStock = stockLevels[fromKey];
            if (fromStock) {
              inventoryActions.updateStockLevel(
                transaction.productId,
                transaction.variantId,
                transaction.fromLocationId,
                {
                  quantity: fromStock.quantity - transaction.quantity,
                },
              );
            }
          }
          quantityChange = transaction.quantity;
          break;
      }

      inventoryActions.updateStockLevel(
        transaction.productId,
        transaction.variantId,
        transaction.toLocationId,
        {
          quantity: current.quantity + quantityChange,
        },
      );
    }
  },

  addAdjustment: (adjustment: InventoryAdjustment) => {
    const adjustments = inventoryStore.adjustments.peek() ?? {};
    inventoryStore.adjustments.set({
      ...adjustments,
      [adjustment.id]: adjustment,
    });

    // Create transactions for each adjustment item
    adjustment.items.forEach((item) => {
      const transaction: InventoryTransaction = {
        id: `adj-${adjustment.id}-${item.productId}`,
        transactionNumber: `ADJ-${adjustment.adjustmentNumber}-${item.productId}`,
        type: "adjustment",
        productId: item.productId,
        variantId: item.variantId,
        toLocationId: adjustment.locationId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        totalCost: item.totalCost,
        reference: adjustment.adjustmentNumber,
        notes: adjustment.description,
        performedBy: adjustment.postedBy ?? "system",
        createdAt: adjustment.createdAt,
        updatedAt: adjustment.updatedAt,
      };

      inventoryActions.addTransaction(transaction);
    });
  },

  reserveStock: (
    productId: string,
    variantId: string,
    locationId: string,
    quantity: number,
  ) => {
    const stockLevels = inventoryStore.stockLevels.peek() ?? {};
    const key = `${productId}-${variantId}-${locationId}`;
    const current = stockLevels[key];

    if (current && current.availableQuantity >= quantity) {
      inventoryActions.updateStockLevel(productId, variantId, locationId, {
        reservedQuantity: current.reservedQuantity + quantity,
      });
      return true;
    }
    return false;
  },

  releaseStock: (
    productId: string,
    variantId: string,
    locationId: string,
    quantity: number,
  ) => {
    const stockLevels = inventoryStore.stockLevels.peek() ?? {};
    const key = `${productId}-${variantId}-${locationId}`;
    const current = stockLevels[key];

    if (current && current.reservedQuantity >= quantity) {
      inventoryActions.updateStockLevel(productId, variantId, locationId, {
        reservedQuantity: current.reservedQuantity - quantity,
      });
      return true;
    }
    return false;
  },
};
