"use client";

import type { Customer } from "@/lib/types/customer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, User } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{customer.name}</h3>
          <Badge
            variant={customer.isActive ? "success" : "secondary"}
            className="mt-1 w-fit"
          >
            {customer.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {customer.contacts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Contacts
            </h4>
            <div className="space-y-2">
              {customer.contacts.map((contact, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-muted-foreground">{contact.role}</div>
                    <div className="mt-1 flex items-center space-x-2">
                      {contact.contactType === "email" ? (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{contact.email}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <div>{customer.address.street}</div>
              <div>
                {customer.address.city}, {customer.address.state}{" "}
                {customer.address.postalCode}
              </div>
              <div>{customer.address.country}</div>
            </div>
          </div>
        </div>
        {customer.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
            <p className="text-sm">{customer.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
