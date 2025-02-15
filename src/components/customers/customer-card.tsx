"use client";

import type { Customer } from "@/lib/types/customer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{customer.name}</h3>
          {customer.isActive && <Badge variant="success">Active</Badge>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm">{customer.contact.phone}</span>
          </div>

          {customer.contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm">{customer.contact.email}</span>
            </div>
          )}

          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm">{customer.address}</span>
          </div>

          {customer.notes && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-muted-foreground">{customer.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
