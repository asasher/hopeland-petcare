import type { BaseEntity } from "./common";

export type ContactInfo = {
  phone: string;
  email?: string;
};

// Main customer type
export type Customer = BaseEntity & {
  name: string;
  isActive: boolean;
  address: string;
  contact: ContactInfo;
  notes?: string;
};
