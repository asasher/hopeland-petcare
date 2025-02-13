import type { BaseEntity } from "./common";

// Purchase order line item
export type PurchaseOrderItem = BaseEntity & {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
};

// Main purchase order type
export type PurchaseOrder = BaseEntity & {
  vendorId: string;
  receivedAt: Date;
  paidAt: Date;
  items: PurchaseOrderItem[];
  total: number;
  expectedDeliveryDate?: string;
  notes?: string;
};
