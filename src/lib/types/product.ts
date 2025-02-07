import type { BaseEntity } from "./common";

// Product category
export type ProductCategory = BaseEntity & {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
};

// Product attribute
export type ProductAttribute = {
  name: string;
  value: string;
};

// Product type
export type Product = BaseEntity & {
  name: string;
  description: string;
  isActive: boolean;
  notes?: string;
  tags: string[];
  images: {
    id: string;
    url: string;
    alt?: string;
    position: number;
  }[];
};

// Product with relations
export type ProductWithRelations = Product;
