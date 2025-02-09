import type { BaseEntity, Address, Contact } from "./common";

// Customer status
export type CustomerStatus = "active" | "inactive";

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
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  address: Address;
  contacts: Contact[];
  notes?: string;
};
