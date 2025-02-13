import type { BaseEntity } from "./common";

// Sales order line item
export type SalesOrderItem = BaseEntity & {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
};

// Main sales order type
export type SalesOrder = BaseEntity & {
  customerId: string;
  deliveredAt: Date;
  paidAt: Date;
  items: SalesOrderItem[];
  total: number;
  notes?: string;
};
