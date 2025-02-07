"use client";

import type { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
        <footer className="border-t">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                © 2024 Hopeland Petcare. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
