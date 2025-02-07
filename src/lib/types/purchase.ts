import type { BaseEntity } from "./common";

// Purchase order status
export type PurchaseOrderStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "ordered"
  | "partial"
  | "received"
  | "cancelled";

// Purchase order line item
export type PurchaseOrderItem = {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  receivedQuantity: number;
  notes?: string;
};

// Receiving details
export type ReceivingDetails = {
  receivedAt: string;
  receivedBy: string;
  locationId: string;
  notes?: string;
};

// Main purchase order type
export type PurchaseOrder = BaseEntity & {
  orderNumber: string;
  vendorId: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  expectedDeliveryDate?: string;
  receivingDetails?: ReceivingDetails;
  notes?: string;
  tags: string[];
  approvedBy?: string;
  approvedAt?: string;
};
