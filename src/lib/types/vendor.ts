import type { BaseEntity, Address, Contact } from "./common";

// Main vendor type
export type VendorStatus = "active" | "inactive";

export type Vendor = BaseEntity & {
  name: string;
  email: string;
  phone: string;
  status: VendorStatus;
  address: Address;
  contacts: Contact[];
  notes?: string;
  taxId?: string;
  creditLimit?: number;
  rating?: number;
  leadTime?: number; // in days
};
