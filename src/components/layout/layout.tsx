"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "./sidebar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative flex min-h-screen w-full">
        <SidebarTrigger />
        <div className="container flex-1 space-y-4 p-8 pt-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
