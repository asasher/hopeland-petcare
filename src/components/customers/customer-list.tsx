"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { Customer } from "@/lib/types/customer";
import { customerStore } from "@/lib/state/customers";
import { useObservable } from "@legendapp/state/react";
import { CustomerForm } from "./customer-form";
import { CustomerCard } from "./customer-card";
import Fuse from "fuse.js";

export function CustomerList() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const customers = useObservable(customerStore.items);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  useEffect(() => {
    // Initial value
    setCustomerList(Object.values(customers.get() || {}));

    // Subscribe to changes
    const unsubscribe = customers.onChange((value) => {
      setCustomerList(Object.values(value || {}));
    });

    // Cleanup subscription
    return unsubscribe;
  }, [customers]);

  const fuse = useMemo(
    () =>
      new Fuse(customerList, {
        keys: [
          "name",
          "contacts.name",
          "contacts.email",
          "contacts.phone",
          "contacts.role",
          "address.street",
          "address.city",
          "address.state",
          "address.country",
          "notes",
        ],
        threshold: 0.3,
        includeMatches: true,
      }),
    [customerList],
  );

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customerList;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, customerList, fuse]);

  const handleCreate = () => {
    setIsCreating(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <span className="text-sm text-muted-foreground">
              {filteredCustomers.filter((c) => c.isActive).length} active
            </span>
            <span className="hidden text-muted-foreground sm:inline">/</span>
            <span className="text-sm text-muted-foreground">
              {filteredCustomers.length} total
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => {
              // Handle click - could open edit form or details view
            }}
          />
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No customers found
          </div>
        )}
      </div>
      <CustomerForm open={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}
