import type { BaseEntity } from "./common";

export type PurchaseOrderStatus =
  | "draft"
  | "ordered"
  | "received"
  | "cancelled";

export type PurchaseOrderItem = {
  productId: string;
  quantity: number;
  price: number;
  total: number;
  receivedQuantity?: number;
};

export type PurchaseOrder = BaseEntity & {
  orderNumber: string;
  vendorId: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  total: number;
  expectedDeliveryDate?: string;
  receivedAt?: string;
  notes?: string;
};
