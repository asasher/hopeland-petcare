import type { BaseEntity, Address, Contact } from "./common";

// Main customer type
export type Customer = BaseEntity & {
  name: string;
  isActive: boolean;
  address: Address;
  contacts: Contact[];
  notes?: string;
};
