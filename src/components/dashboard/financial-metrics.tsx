"use client";

import { useObservable } from "@legendapp/state/react";
import { accountingStore } from "@/lib/state/accounting";
import { formatCurrency } from "@/lib/utils/format";
import type { Account, AccountType } from "@/lib/types/accounting";

export function FinancialMetrics() {
  const accounting = useObservable(accountingStore);
  const metrics = {
    totalAssets: accounting.totalAssets.get() ?? 0,
    totalLiabilities: accounting.totalLiabilities.get() ?? 0,
    totalEquity: accounting.totalEquity.get() ?? 0,
    totalRevenue: accounting.totalRevenue.get() ?? 0,
    totalExpenses: accounting.totalExpenses.get() ?? 0,
  };

  const accountsMap = accounting.accounts.get() ?? {};
  const accounts = Object.values(accountsMap) as Account[];
  const activeAccounts = accounts.filter((account) => account.isActive);
  const accountsByType = accounts.reduce(
    (acc, account) => {
      if (!acc[account.type]) {
        acc[account.type] = [];
      }
      acc[account.type].push(account);
      return acc;
    },
    {} as Record<AccountType, Account[]>,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Financial Overview</h2>
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Assets
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalAssets)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Liabilities
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalLiabilities)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Equity
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(metrics.totalEquity)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </div>
          <div className="mt-2 text-2xl font-bold text-green-500">
            {formatCurrency(metrics.totalRevenue)}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </div>
          <div className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(metrics.totalExpenses)}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Account Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Total Accounts</div>
            <div className="mt-1 text-2xl font-bold">{accounts.length}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Active: {activeAccounts.length}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Net Income</div>
            <div
              className={`mt-1 text-2xl font-bold ${
                metrics.totalRevenue - metrics.totalExpenses >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {formatCurrency(metrics.totalRevenue - metrics.totalExpenses)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-lg font-semibold">Accounts by Type</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(accountsByType).map(([type, accounts]) => (
            <div key={type} className="space-y-2">
              <div className="text-sm font-medium capitalize">{type}</div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Count: {accounts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total:{" "}
                  {formatCurrency(
                    accounts.reduce((sum, acc) => sum + acc.balance, 0),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
