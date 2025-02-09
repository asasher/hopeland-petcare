import type { BaseEntity, Address, Contact } from "./common";

// Main vendor type
export type VendorStatus = "active" | "inactive";

export type Vendor = BaseEntity & {
  name: string;
  isActive: boolean;
  address: Address;
  contacts: Contact[];
  notes?: string;
  leadTime?: number; // in days
};
