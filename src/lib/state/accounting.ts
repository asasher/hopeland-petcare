import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type {
  Account,
  AccountType,
  AccountCategory,
  JournalEntry,
  AccountReceivable,
  AccountPayable,
  AgingBucket,
  AgingReportItem,
} from "../types/accounting";

// Accounting specific state
type AccountingState = BaseState<Account> & {
  accounts: Record<string, Account>;
  journalEntries: Record<string, JournalEntry>;
  accountsReceivable: Record<string, AccountReceivable>;
  accountsPayable: Record<string, AccountPayable>;
  accountsByType: Record<AccountType, string[]>;
  accountsByCategory: Record<AccountCategory, string[]>;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
};

// Initialize state
const initialState: Partial<AccountingState> = {
  items: {},
  accounts: {},
  journalEntries: {},
  accountsReceivable: {},
  accountsPayable: {},
  accountsByType: {
    asset: [],
    liability: [],
    equity: [],
    revenue: [],
    expense: [],
  },
  accountsByCategory: {
    "current-asset": [],
    "fixed-asset": [],
    "current-liability": [],
    "long-term-liability": [],
    "owner-equity": [],
    "operating-revenue": [],
    "other-revenue": [],
    "operating-expense": [],
    "other-expense": [],
  },
  totalAssets: 0,
  totalLiabilities: 0,
  totalEquity: 0,
  totalRevenue: 0,
  totalExpenses: 0,
};

// Create the store with type
export const accountingStore = createDomainStore<Account>(
  "accounting",
  initialState,
) as unknown as Observable<AccountingState>;

// Computed values
export const accountsByType = computed(() => {
  const accounts = Object.values(accountingStore.accounts.peek() ?? {});
  return accounts.reduce(
    (acc, account) => {
      const type = account.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(account.id);
      return acc;
    },
    {} as Record<AccountType, string[]>,
  );
});

export const accountsByCategory = computed(() => {
  const accounts = Object.values(accountingStore.accounts.peek() ?? {});
  return accounts.reduce(
    (acc, account) => {
      const category = account.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(account.id);
      return acc;
    },
    {} as Record<AccountCategory, string[]>,
  );
});

export const financialMetrics = computed(() => {
  const accounts = Object.values(accountingStore.accounts.peek() ?? {});
  return accounts.reduce(
    (metrics, account) => {
      switch (account.type) {
        case "asset":
          metrics.totalAssets += account.balance;
          break;
        case "liability":
          metrics.totalLiabilities += account.balance;
          break;
        case "equity":
          metrics.totalEquity += account.balance;
          break;
        case "revenue":
          metrics.totalRevenue += account.balance;
          break;
        case "expense":
          metrics.totalExpenses += account.balance;
          break;
      }
      return metrics;
    },
    {
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
      totalRevenue: 0,
      totalExpenses: 0,
    },
  );
});

export const arAgingReport = computed(() => {
  const receivables = Object.values(
    accountingStore.accountsReceivable.peek() ?? {},
  );
  const report: Record<AgingBucket, AgingReportItem[]> = {
    current: [],
    "1-30": [],
    "31-60": [],
    "61-90": [],
    "90+": [],
  };

  receivables.forEach((ar) => {
    const daysOverdue = Math.floor(
      (new Date().getTime() - new Date(ar.dueDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const bucket: AgingBucket =
      daysOverdue <= 0
        ? "current"
        : daysOverdue <= 30
          ? "1-30"
          : daysOverdue <= 60
            ? "31-60"
            : daysOverdue <= 90
              ? "61-90"
              : "90+";

    report[bucket].push({
      entityId: ar.customerId,
      entityName: ar.customer?.firstName ?? "Unknown",
      totalAmount: ar.balance,
      buckets: { [bucket]: ar.balance } as Record<AgingBucket, number>,
    });
  });

  return report;
});

export const apAgingReport = computed(() => {
  const payables = Object.values(accountingStore.accountsPayable.peek() ?? {});
  const report: Record<AgingBucket, AgingReportItem[]> = {
    current: [],
    "1-30": [],
    "31-60": [],
    "61-90": [],
    "90+": [],
  };

  payables.forEach((ap) => {
    const daysOverdue = Math.floor(
      (new Date().getTime() - new Date(ap.dueDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const bucket: AgingBucket =
      daysOverdue <= 0
        ? "current"
        : daysOverdue <= 30
          ? "1-30"
          : daysOverdue <= 60
            ? "31-60"
            : daysOverdue <= 90
              ? "61-90"
              : "90+";

    report[bucket].push({
      entityId: ap.vendorId,
      entityName: ap.vendor?.name ?? "Unknown",
      totalAmount: ap.balance,
      buckets: { [bucket]: ap.balance } as Record<AgingBucket, number>,
    });
  });

  return report;
});

// Actions
export const accountingActions = {
  addAccount: (account: Account) => {
    const accounts = accountingStore.accounts.peek() ?? {};
    accountingStore.accounts.set({ ...accounts, [account.id]: account });

    // Update type indexes
    const accountsByType = accountingStore.accountsByType.peek() ?? {};
    const currentTypeAccounts = accountsByType[account.type] ?? [];
    accountsByType[account.type] = [...currentTypeAccounts, account.id];
    accountingStore.accountsByType.set(accountsByType);

    // Update category indexes
    const accountsByCategory = accountingStore.accountsByCategory.peek() ?? {};
    const currentCategoryAccounts = accountsByCategory[account.category] ?? [];
    accountsByCategory[account.category] = [
      ...currentCategoryAccounts,
      account.id,
    ];
    accountingStore.accountsByCategory.set(accountsByCategory);
  },

  updateAccount: (id: string, updates: Partial<Account>) => {
    const accounts = accountingStore.accounts.peek() ?? {};
    const current = accounts[id];
    if (current) {
      const updated = { ...current, ...updates };
      accountingStore.accounts.set({ ...accounts, [id]: updated });

      // Update type indexes if type changed
      if (updates.type && updates.type !== current.type) {
        const accountsByType = accountingStore.accountsByType.peek() ?? {};
        const currentTypeAccounts = accountsByType[current.type] ?? [];
        const newTypeAccounts = accountsByType[updates.type] ?? [];

        accountsByType[current.type] = currentTypeAccounts.filter(
          (accountId) => accountId !== id,
        );
        accountsByType[updates.type] = [...newTypeAccounts, id];
        accountingStore.accountsByType.set(accountsByType);
      }

      // Update category indexes if category changed
      if (updates.category && updates.category !== current.category) {
        const accountsByCategory =
          accountingStore.accountsByCategory.peek() ?? {};
        const currentCategoryAccounts =
          accountsByCategory[current.category] ?? [];
        const newCategoryAccounts = accountsByCategory[updates.category] ?? [];

        accountsByCategory[current.category] = currentCategoryAccounts.filter(
          (accountId) => accountId !== id,
        );
        accountsByCategory[updates.category] = [...newCategoryAccounts, id];
        accountingStore.accountsByCategory.set(accountsByCategory);
      }
    }
  },

  deleteAccount: (id: string) => {
    const accounts = accountingStore.accounts.peek() ?? {};
    const account = accounts[id];
    if (account) {
      // Remove from main accounts
      delete accounts[id];
      accountingStore.accounts.set(accounts);

      // Remove from type indexes
      const accountsByType = accountingStore.accountsByType.peek() ?? {};
      const currentTypeAccounts = accountsByType[account.type] ?? [];
      accountsByType[account.type] = currentTypeAccounts.filter(
        (accountId) => accountId !== id,
      );
      accountingStore.accountsByType.set(accountsByType);

      // Remove from category indexes
      const accountsByCategory =
        accountingStore.accountsByCategory.peek() ?? {};
      const currentCategoryAccounts =
        accountsByCategory[account.category] ?? [];
      accountsByCategory[account.category] = currentCategoryAccounts.filter(
        (accountId) => accountId !== id,
      );
      accountingStore.accountsByCategory.set(accountsByCategory);
    }
  },

  addJournalEntry: (entry: JournalEntry) => {
    const entries = accountingStore.journalEntries.peek() ?? {};
    accountingStore.journalEntries.set({ ...entries, [entry.id]: entry });

    // Update account balances
    entry.lines.forEach((line) => {
      const accounts = accountingStore.accounts.peek() ?? {};
      const account = accounts[line.accountId];
      if (account) {
        const balance = account.balance + (line.debit - line.credit);
        accountingActions.updateAccount(line.accountId, { balance });
      }
    });
  },

  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => {
    const entries = accountingStore.journalEntries.peek() ?? {};
    const current = entries[id];
    if (current) {
      // Reverse previous entry's effect on account balances
      current.lines.forEach((line) => {
        const accounts = accountingStore.accounts.peek() ?? {};
        const account = accounts[line.accountId];
        if (account) {
          const balance = account.balance - (line.debit - line.credit);
          accountingActions.updateAccount(line.accountId, { balance });
        }
      });

      // Apply new entry's effect on account balances
      const updated = { ...current, ...updates };
      accountingStore.journalEntries.set({ ...entries, [id]: updated });

      updated.lines.forEach((line) => {
        const accounts = accountingStore.accounts.peek() ?? {};
        const account = accounts[line.accountId];
        if (account) {
          const balance = account.balance + (line.debit - line.credit);
          accountingActions.updateAccount(line.accountId, { balance });
        }
      });
    }
  },

  deleteJournalEntry: (id: string) => {
    const entries = accountingStore.journalEntries.peek() ?? {};
    const entry = entries[id];
    if (entry) {
      // Reverse entry's effect on account balances
      entry.lines.forEach((line) => {
        const accounts = accountingStore.accounts.peek() ?? {};
        const account = accounts[line.accountId];
        if (account) {
          const balance = account.balance - (line.debit - line.credit);
          accountingActions.updateAccount(line.accountId, { balance });
        }
      });

      // Remove entry
      delete entries[id];
      accountingStore.journalEntries.set(entries);
    }
  },

  addAccountReceivable: (ar: AccountReceivable) => {
    const receivables = accountingStore.accountsReceivable.peek() ?? {};
    accountingStore.accountsReceivable.set({ ...receivables, [ar.id]: ar });
  },

  updateAccountReceivable: (
    id: string,
    updates: Partial<AccountReceivable>,
  ) => {
    const receivables = accountingStore.accountsReceivable.peek() ?? {};
    const current = receivables[id];
    if (current) {
      accountingStore.accountsReceivable.set({
        ...receivables,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteAccountReceivable: (id: string) => {
    const receivables = accountingStore.accountsReceivable.peek() ?? {};
    delete receivables[id];
    accountingStore.accountsReceivable.set(receivables);
  },

  addAccountPayable: (ap: AccountPayable) => {
    const payables = accountingStore.accountsPayable.peek() ?? {};
    accountingStore.accountsPayable.set({ ...payables, [ap.id]: ap });
  },

  updateAccountPayable: (id: string, updates: Partial<AccountPayable>) => {
    const payables = accountingStore.accountsPayable.peek() ?? {};
    const current = payables[id];
    if (current) {
      accountingStore.accountsPayable.set({
        ...payables,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteAccountPayable: (id: string) => {
    const payables = accountingStore.accountsPayable.peek() ?? {};
    delete payables[id];
    accountingStore.accountsPayable.set(payables);
  },
};
