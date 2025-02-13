import type { BaseEntity } from "./common";

export type PurchaseOrderStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "ordered"
  | "partial"
  | "received"
  | "cancelled";

export type PurchaseOrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  receivedQuantity: number;
  notes?: string;
};

export type ReceivingDetails = {
  receivedAt: string;
  receivedBy: string;
  locationId: string;
  notes?: string;
};

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
