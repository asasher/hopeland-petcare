"use client";

import { useState } from "react";
import { ProductList } from "@/components/products/product-list";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  return (
    <main className="container mx-auto space-y-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hopeland Petcare</h1>
        <Button onClick={() => setIsProductFormOpen(true)}>
          Add New Product
        </Button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-semibold">Products</h2>
          <ProductList />
        </div>
      </div>

      <ProductForm
        open={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
      />
    </main>
  );
}
