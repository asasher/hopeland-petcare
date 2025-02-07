// Common types
export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// Product category and subcategory
export type ProductCategory = {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
};

// Product variants and attributes
export type ProductAttribute = {
  name: string;
  value: string;
};

export type ProductVariant = BaseEntity & {
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  attributes: ProductAttribute[];
  stockQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
};

// Main product type
export type Product = BaseEntity & {
  name: string;
  description: string;
  categoryId: string;
  brand?: string;
  isActive: boolean;
  images: string[];
  variants: ProductVariant[];
  defaultVariantId: string;
  taxRate: number;
  notes?: string;
  tags: string[];
};

// Product with relationships
export type ProductWithRelations = Product & {
  category: ProductCategory;
};
