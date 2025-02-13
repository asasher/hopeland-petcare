import type { BaseEntity } from "./common";

// Product type
export type Product = BaseEntity & {
  name: string;
  description: string;
  unit: string;
  unitPrice: number;
  runningAveragePrice: number; // calculated from all sales orders
  runningAverageCost: number; // calculated from all purchase orders
  isActive: boolean;
  notes?: string;
};

// Product with relations
export type ProductWithRelations = Product;
