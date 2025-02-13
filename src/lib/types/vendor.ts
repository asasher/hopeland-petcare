import type { BaseEntity } from "./common";

export type Vendor = BaseEntity & {
  name: string;
  isActive: boolean;
  address: string;
  phoneNumber: string;
  email?: string;
  notes?: string;
  leadTime?: number; // in days
};
