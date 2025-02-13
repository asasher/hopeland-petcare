import type { BaseEntity } from "./common";
import type { ContactInfo } from "./customer";

export type Vendor = BaseEntity & {
  name: string;
  isActive: boolean;
  address: string;
  contact: ContactInfo;
  leadTime?: number; // in days
  notes?: string;
};
