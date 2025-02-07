import type { BaseEntity } from "./common";
import type { Address, Contact } from "./customer";

// Vendor status
export type VendorStatus = "active" | "inactive" | "blocked";

// Main vendor type
export type Vendor = BaseEntity & {
  code: string;
  name: string;
  status: VendorStatus;
  addresses: Address[];
  contacts: Contact[];
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
