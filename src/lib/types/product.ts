import type { BaseEntity } from "./common";

// Product type
export type Product = BaseEntity & {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  notes?: string;
};

// Product with relations
export type ProductWithRelations = Product;
