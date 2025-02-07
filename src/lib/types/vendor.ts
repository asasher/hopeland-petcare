import type { BaseEntity } from "./product";
import type { Address, Contact } from "./customer";

// Vendor status
export type VendorStatus = "active" | "inactive" | "blocked";

// Payment terms
export type PaymentTerms = {
  type: "net" | "cod" | "prepaid";
  days?: number;
  discount?: {
    percentage: number;
    days: number;
  };
};

// Vendor category
export type VendorCategory =
  | "supplier"
  | "manufacturer"
  | "distributor"
  | "service";

// Main vendor type
export type Vendor = BaseEntity & {
  code: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  addresses: Address[];
  contacts: Contact[];
  paymentTerms: PaymentTerms;
  taxId?: string;
  website?: string;
  notes?: string;
  tags: string[];
  creditLimit?: number;
  balance: number;
  rating?: number;
  leadTime?: number; // in days
  minimumOrderValue?: number;
};
