import type { Customer } from "../types/customer";
import type { Vendor } from "../types/vendor";
import type { Product } from "../types/product";
import type { SalesOrder } from "../types/sales";
import type { PurchaseOrder } from "../types/purchase";
import type { InventoryItem, InventoryAdjustment } from "../types/inventory";

// Mock data generator utilities
const generateId = () => crypto.randomUUID();
const generateDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock initial data
export const mockCustomers: Record<string, Customer> = {
  "customer-1": {
    id: "customer-1",
    name: "John's Pet Shop",
    isActive: true,
    address: "123 Main St, San Francisco, CA 94105",
    contact: {
      phone: "415-555-0123",
      email: "john@petshop.com",
    },
    notes: "Regular customer since 2020",
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
};

export const mockVendors: Record<string, Vendor> = {
  "vendor-1": {
    id: "vendor-1",
    name: "Pet Supplies Co",
    isActive: true,
    address: "456 Market St, Los Angeles, CA 90012",
    contact: {
      phone: "213-555-0123",
      email: "bob@petsupplies.com",
    },
    notes: "Premium supplier",
    leadTime: 3,
    createdAt: generateDate(180),
    updatedAt: generateDate(7),
  },
};

export const mockProducts: Record<string, Product> = {
  "product-1": {
    id: "product-1",
    name: "Premium Dog Food",
    description: "High-quality dog food for all breeds",
    price: 49.99,
    isActive: true,
    notes: "Best seller",
    createdAt: generateDate(90),
    updatedAt: generateDate(1),
  },
};

export const mockSalesOrders: Record<string, SalesOrder> = {
  "sales-1": {
    id: "sales-1",
    orderNumber: "SO-001",
    customerId: "customer-1",
    status: "delivered",
    items: [
      {
        productId: "product-1",
        quantity: 5,
        price: 49.99,
        total: 249.95,
      },
    ],
    total: 249.95,
    shipping: {
      address: "123 Main St, San Francisco, CA 94105, USA",
      phone: "415-555-0123",
      trackingNumber: "1234567890",
    },
    isPaid: true,
    paidAt: generateDate(0),
    notes: "Priority shipping requested",
    createdAt: generateDate(14),
    updatedAt: generateDate(0),
  },
};

export const mockPurchaseOrders: Record<string, PurchaseOrder> = {
  "purchase-1": {
    id: "purchase-1",
    orderNumber: "PO-001",
    vendorId: "vendor-1",
    status: "received",
    items: [
      {
        productId: "product-1",
        quantity: 100,
        price: 29.99,
        total: 2999.0,
        receivedQuantity: 100,
      },
    ],
    total: 2999.0,
    expectedDeliveryDate: generateDate(-7),
    receivedAt: generateDate(0),
    notes: "Quarterly stock replenishment",
    createdAt: generateDate(14),
    updatedAt: generateDate(0),
  },
};

export const mockInventoryItems: Record<string, InventoryItem> = {
  "inventory-1": {
    id: "inventory-1",
    productId: "product-1",
    quantity: 150,
    notes: "Regular stock item",
    createdAt: generateDate(90),
    updatedAt: generateDate(0),
  },
};

export const mockInventoryAdjustments: Record<string, InventoryAdjustment> = {
  "adjustment-1": {
    id: "adjustment-1",
    productId: "product-1",
    quantity: -5,
    reason: "damage",
    notes: "Damaged during storage",
    createdAt: generateDate(7),
    updatedAt: generateDate(7),
  },
};
