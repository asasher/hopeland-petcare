import type { BaseEntity } from "./common";

// Inventory adjustment reason
export type AdjustmentReason = "damage" | "correction" | "other";

// Inventory adjustment
export type InventoryAdjustment = BaseEntity & {
  productId: string;
  quantity: number; // positive for additions, negative for reductions
  reason: AdjustmentReason;
  notes?: string;
};

// Inventory item
export type InventoryItem = BaseEntity & {
  productId: string;
  quantity: number; // current quantity in stock
  notes?: string;
};
