import type { BaseEntity } from "./product";

// Inventory transaction types
export type InventoryTransactionType =
  | "purchase"
  | "sale"
  | "return"
  | "adjustment"
  | "transfer";

// Inventory location
export type Location = BaseEntity & {
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isActive: boolean;
  notes?: string;
};

// Stock level
export type StockLevel = {
  productId: string;
  variantId: string;
  locationId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
};

// Inventory transaction
export type InventoryTransaction = BaseEntity & {
  transactionNumber: string;
  type: InventoryTransactionType;
  productId: string;
  variantId: string;
  fromLocationId?: string;
  toLocationId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reference?: string;
  notes?: string;
  performedBy: string;
};

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
  adjustmentNumber: string;
  locationId: string;
  reason: AdjustmentReason;
  description: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    notes?: string;
  }>;
  status: "draft" | "posted" | "void";
  postedBy?: string;
  postedAt?: string;
  notes?: string;
};
