"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { customerStore } from "@/lib/state/customers";
import { vendorStore } from "@/lib/state/vendors";
import { productStore } from "@/lib/state/products";
import { salesStore } from "@/lib/state/sales";
import { purchaseStore } from "@/lib/state/purchases";
import { inventoryStore } from "@/lib/state/inventory";

export function Settings() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    // Reset all domain stores
    customerStore.items.set({});
    vendorStore.items.set({});
    productStore.items.set({});
    salesStore.items.set({});
    purchaseStore.items.set({});
    inventoryStore.items.set({});

    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Application Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Reset Application Data</h3>
              <p className="text-sm text-muted-foreground">
                This will permanently delete all data from the application. This
                action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowResetConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your data including customers, vendors, products, sales,
              purchases, and inventory data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
