import type { Customer } from "../types/customer";
import type { Vendor } from "../types/vendor";
import type { Product } from "../types/product";
import type { SalesOrder } from "../types/sales";
import type { PurchaseOrder } from "../types/purchase";
import type { Account } from "../types/accounting";

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
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA",
    },
    contacts: [
      {
        contactType: "email" as const,
        name: "John Doe",
        email: "john@petshop.com",
        role: "Owner",
      },
      {
        contactType: "phone" as const,
        name: "Jane Doe",
        phone: "415-555-0123",
        role: "Manager",
      },
    ],
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
    address: {
      street: "456 Market St",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90012",
      country: "USA",
    },
    contacts: [
      {
        contactType: "email" as const,
        name: "Bob Smith",
        email: "bob@petsupplies.com",
        role: "Sales Rep",
      },
    ],
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
    status: "confirmed",
    paymentStatus: "paid",
    items: [
      {
        productId: "product-1",
        variantId: "default",
        quantity: 5,
        unitPrice: 49.99,
        discount: 0,
        tax: 4.99,
        total: 274.94,
        notes: "Regular order",
      },
    ],
    subtotal: 249.95,
    tax: 24.99,
    shipping: 15,
    discount: 0,
    total: 289.94,
    shippingDetails: {
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105",
      phone: "415-555-0123",
      carrier: "FedEx",
      estimatedDelivery: generateDate(-7),
      trackingNumber: "1234567890",
    },
    paymentDetails: {
      method: "credit-card",
      transactionId: "txn_123456",
      amount: 289.94,
      currency: "USD",
      paidAt: generateDate(0),
      notes: "Payment received",
    },
    notes: "Priority shipping requested",
    tags: ["retail", "local"],
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
        variantId: "default",
        quantity: 100,
        unitPrice: 29.99,
        tax: 299.9,
        total: 3298.9,
        receivedQuantity: 100,
        notes: "Bulk order",
      },
    ],
    subtotal: 2999.0,
    tax: 299.9,
    total: 3298.9,
    expectedDeliveryDate: generateDate(-7),
    receivingDetails: {
      receivedAt: generateDate(0),
      receivedBy: "Jane Doe",
      locationId: "main-warehouse",
      notes: "All items received in good condition",
    },
    notes: "Quarterly stock replenishment",
    tags: ["bulk", "regular-vendor"],
    createdAt: generateDate(14),
    updatedAt: generateDate(0),
    approvedBy: "John Smith",
    approvedAt: generateDate(13),
  },
};

export const mockAccounts: Record<string, Account> = {
  "account-1": {
    id: "account-1",
    code: "1000",
    name: "Cash",
    type: "asset",
    category: "current-asset",
    description: "Cash on hand",
    isActive: true,
    balance: 50000,
    tags: ["cash", "current-asset"],
    createdAt: generateDate(365),
    updatedAt: generateDate(0),
  },
  "account-2": {
    id: "account-2",
    code: "4000",
    name: "Sales Revenue",
    type: "revenue",
    category: "operating-revenue",
    description: "Revenue from sales",
    isActive: true,
    balance: 150000,
    tags: ["revenue", "sales"],
    createdAt: generateDate(365),
    updatedAt: generateDate(0),
  },
};
