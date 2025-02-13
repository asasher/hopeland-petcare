import type { BaseEntity } from "./common";

// Main customer type
export type Customer = BaseEntity & {
  name: string;
  isActive: boolean;
  address: string;
  phoneNumber: string;
  email?: string;
  notes?: string;
};
