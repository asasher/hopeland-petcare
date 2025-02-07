import type { BaseEntity } from "./common";

// Sales order status
export type SalesOrderStatus =
  | "draft"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

// Payment status
export type PaymentStatus =
  | "pending"
  | "partial"
  | "paid"
  | "refunded"
  | "void";

// Sales order line item
export type SalesOrderItem = {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
};

// Shipping details
export type ShippingDetails = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
};

// Payment details
export type PaymentDetails = {
  method: string;
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
  notes?: string;
};

// Main sales order type
export type SalesOrder = BaseEntity & {
  orderNumber: string;
  customerId: string;
  status: SalesOrderStatus;
  paymentStatus: PaymentStatus;
  items: SalesOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingDetails: ShippingDetails;
  paymentDetails: PaymentDetails;
  notes?: string;
  tags: string[];
};
