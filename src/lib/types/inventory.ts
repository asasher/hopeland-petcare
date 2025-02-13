import type { BaseEntity } from "./common";

// Inventory adjustment reason
export type AdjustmentReason =
  | "damage"
  | "loss"
  | "theft"
  | "expiry"
  | "correction"
  | "other";

// Inventory adjustment
export type InventoryAdjustment = BaseEntity & {
  productId: string;
  adjustmentValue: number; // this will change the available quantity of the product and later used to calculate availableQuantity
  reason: AdjustmentReason;
  notes?: string;
};

// Inventory item
export type InventoryItem = BaseEntity & {
  productId: string;
  availableQuantity: number; // calculated from all purchase orders, sales orders and inventory adjustments
  notes?: string;
};
