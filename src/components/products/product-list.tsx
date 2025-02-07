"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { productStore } from "@/lib/state/products";
import { useObservable } from "@legendapp/state/react";
import { ProductForm } from "./product-form";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => row.original.tags.join(", "),
  },
];

export function ProductList() {
  const [isCreating, setIsCreating] = useState(false);
  const products = useObservable(productStore.items);
  const productList = Object.values(products.get() || {});

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <div className="min-h-[200px]">
        <DataTable
          columns={columns}
          data={productList}
          searchKey="name"
          toolbar={
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-sm">
                {productList.length} products
              </span>
            </div>
          }
        />
      </div>
      <ProductForm open={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
