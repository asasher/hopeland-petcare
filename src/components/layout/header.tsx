"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
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
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-4 flex items-center space-x-2">
          <span className="font-bold">Hopeland Petcare</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 items-center space-x-2">
          <Button variant="ghost" onClick={() => router.push("/")}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => router.push("/products")}>
            Products
          </Button>
          <Button variant="ghost" onClick={() => router.push("/sales")}>
            Sales
          </Button>
          <Button variant="ghost" onClick={() => router.push("/purchases")}>
            Purchases
          </Button>
          <Button variant="ghost" onClick={() => router.push("/customers")}>
            Customers
          </Button>
          <Button variant="ghost" onClick={() => router.push("/vendors")}>
            Vendors
          </Button>
          <Button variant="ghost" onClick={() => router.push("/inventory")}>
            Inventory
          </Button>
          <Button variant="ghost" onClick={() => router.push("/accounting")}>
            Accounting
          </Button>
        </nav>

        {/* User menu */}
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
