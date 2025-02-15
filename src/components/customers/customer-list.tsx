"use client";

import { useState } from "react";
import { useObservable } from "@legendapp/state/react";
import { customerStore } from "@/lib/state/customers";
import { CustomerCard } from "./customer-card";
import { CustomerForm } from "./customer-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CustomerList() {
  const customers = useObservable(customerStore.items);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const handleOpenForm = (customerId?: string) => {
    setSelectedCustomer(customerId ?? null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedCustomer(null);
    setIsFormOpen(false);
  };

  const customerList = Object.entries(customers.get() ?? {}).map(
    ([id, customer]) => customer,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {customerList.map((customer) => (
          <div
            key={customer.id}
            className="cursor-pointer"
            onClick={() => handleOpenForm(customer.id)}
          >
            <CustomerCard customer={customer} />
          </div>
        ))}
      </div>

      <CustomerForm
        open={isFormOpen}
        onClose={handleCloseForm}
        initialData={
          selectedCustomer ? customers.get()?.[selectedCustomer] : undefined
        }
      />
    </div>
  );
}
