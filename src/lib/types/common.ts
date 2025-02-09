// Base type for all entities in the system
export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Contact = {
  name: string;
  role: string;
} & (
  | {
      contactType: "email";
      email: string;
      phone?: string;
    }
  | {
      contactType: "phone";
      email?: string;
      phone: string;
    }
);
