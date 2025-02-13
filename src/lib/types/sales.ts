import type { BaseEntity } from "./common";

export type SalesOrderStatus =
  | "draft"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type SalesOrderItem = {
  productId: string;
  quantity: number;
  price: number;
  total: number;
};

export type ShippingInfo = {
  address: string;
  phone: string;
  trackingNumber?: string;
};

// Main sales order type
export type SalesOrder = BaseEntity & {
  orderNumber: string;
  customerId: string;
  status: SalesOrderStatus;
  items: SalesOrderItem[];
  total: number;
  shipping: ShippingInfo;
  isPaid: boolean;
  paidAt?: string;
  notes?: string;
};
