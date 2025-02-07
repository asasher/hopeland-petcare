import type { BaseEntity } from "./common";

// Customer status
export type CustomerStatus = "active" | "inactive" | "blocked";

// Customer address
export type Address = {
  type: "billing" | "shipping";
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
};

// Customer contact
export type Contact = {
  type: "phone" | "email" | "other";
  value: string;
  isPrimary: boolean;
};

// Customer preferences
export type CustomerPreferences = {
  preferredContactMethod: "phone" | "email" | "sms";
  marketingOptIn: boolean;
  notificationSettings: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
};

// Main customer type
export type Customer = BaseEntity & {
  code: string;
  firstName: string;
  lastName: string;
  company?: string;
  status: CustomerStatus;
  addresses: Address[];
  contacts: Contact[];
  preferences: CustomerPreferences;
  taxId?: string;
  notes?: string;
  tags: string[];
  creditLimit?: number;
  balance: number;
};
