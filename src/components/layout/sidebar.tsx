"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  UserCircle,
  Warehouse,
  Calculator,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  subItems?: { href: string; label: string }[];
}

function NavItem({ href, icon, label, isActive, subItems }: NavItemProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full justify-start", hasSubItems && "justify-between")}
        onClick={() => {
          if (hasSubItems) {
            setIsOpen(!isOpen);
          } else {
            router.push(href);
          }
        }}
      >
        <span className="flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </span>
        {hasSubItems && (
          <span className="ml-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </Button>
      {hasSubItems && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {subItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start pl-8"
              onClick={() => router.push(item.href)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      href: "/",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      href: "/products",
      icon: <Package className="h-4 w-4" />,
      label: "Products",
      subItems: [
        { href: "/products/categories", label: "Categories" },
        { href: "/products/variants", label: "Variants" },
      ],
    },
    {
      href: "/sales",
      icon: <ShoppingCart className="h-4 w-4" />,
      label: "Sales",
      subItems: [
        { href: "/sales/orders", label: "Orders" },
        { href: "/sales/returns", label: "Returns" },
      ],
    },
    {
      href: "/purchases",
      icon: <Truck className="h-4 w-4" />,
      label: "Purchases",
      subItems: [
        { href: "/purchases/orders", label: "Orders" },
        { href: "/purchases/returns", label: "Returns" },
      ],
    },
    {
      href: "/customers",
      icon: <Users className="h-4 w-4" />,
      label: "Customers",
    },
    {
      href: "/vendors",
      icon: <UserCircle className="h-4 w-4" />,
      label: "Vendors",
    },
    {
      href: "/inventory",
      icon: <Warehouse className="h-4 w-4" />,
      label: "Inventory",
      subItems: [
        { href: "/inventory/stock", label: "Stock Levels" },
        { href: "/inventory/adjustments", label: "Adjustments" },
        { href: "/inventory/transfers", label: "Transfers" },
      ],
    },
    {
      href: "/accounting",
      icon: <Calculator className="h-4 w-4" />,
      label: "Accounting",
      subItems: [
        { href: "/accounting/chart", label: "Chart of Accounts" },
        { href: "/accounting/journals", label: "Journal Entries" },
        { href: "/accounting/receivables", label: "Receivables" },
        { href: "/accounting/payables", label: "Payables" },
      ],
    },
  ];

  return (
    <div className="bg-background flex h-full w-64 flex-col border-r">
      <div className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
            subItems={item.subItems}
          />
        ))}
      </div>
      <Separator />
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start">
          <span className="flex items-center">
            <Users className="h-4 w-4" />
            <span className="ml-2">Team</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
