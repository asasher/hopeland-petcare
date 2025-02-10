"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Package,
  ShoppingCart,
  Store,
  Users,
  Truck,
  BarChart,
  Boxes,
  LogOut,
  Settings,
  User,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const navItems = [
  {
    href: "/products",
    title: "Products",
    icon: <Package className="h-4 w-4" />,
  },
  {
    href: "/sales",
    title: "Sales",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    href: "/purchases",
    title: "Purchases",
    icon: <Store className="h-4 w-4" />,
  },
  {
    href: "/customers",
    title: "Customers",
    icon: <Users className="h-4 w-4" />,
  },
  { href: "/vendors", title: "Vendors", icon: <Truck className="h-4 w-4" /> },
  {
    href: "/inventory",
    title: "Inventory",
    icon: <Boxes className="h-4 w-4" />,
  },
  {
    href: "/accounting",
    title: "Accounting",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    href: "/settings",
    title: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <h2 className="text-lg font-semibold tracking-tight">
            Hopeland Petcare
          </h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span>User Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
