import type { BaseEntity } from "./product";

// Account types
export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense";

// Account categories
export type AccountCategory =
  | "current-asset"
  | "fixed-asset"
  | "current-liability"
  | "long-term-liability"
  | "owner-equity"
  | "operating-revenue"
  | "other-revenue"
  | "operating-expense"
  | "other-expense";

// Chart of accounts
export type Account = BaseEntity & {
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  description?: string;
  isActive: boolean;
  balance: number;
  parentId?: string;
  tags: string[];
};

// Transaction types
export type TransactionType =
  | "sale"
  | "purchase"
  | "payment"
  | "receipt"
  | "journal"
  | "adjustment";

// Journal entry line
export type JournalEntryLine = {
  accountId: string;
  description?: string;
  debit: number;
  credit: number;
};

// Journal entry
export type JournalEntry = BaseEntity & {
  entryNumber: string;
  type: TransactionType;
  date: string;
  description: string;
  lines: JournalEntryLine[];
  reference?: string;
  status: "draft" | "posted" | "void";
  postedBy?: string;
  postedAt?: string;
  tags: string[];
};
