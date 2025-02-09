import type { BaseEntity, Address, Contact } from "./common";

export type Vendor = BaseEntity & {
  name: string;
  isActive: boolean;
  address: Address;
  contacts: Contact[];
  notes?: string;
  leadTime?: number; // in days
};
