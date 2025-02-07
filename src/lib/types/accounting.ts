import type { BaseEntity } from "./product";
import type { Customer } from "./customer";
import type { Vendor } from "./vendor";

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
  | "adjustment"
  | "credit-note"
  | "debit-note";

// Payment method
export type PaymentMethod =
  | "cash"
  | "check"
  | "bank-transfer"
  | "credit-card"
  | "debit-card"
  | "other";

// Payment terms
export type PaymentTerms = {
  dueInDays: number;
  discountPercentage?: number;
  discountIfPaidInDays?: number;
};

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

// Account receivable invoice
export type AccountReceivable = BaseEntity & {
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  date: string;
  dueDate: string;
  amount: number;
  balance: number;
  status: "open" | "partial" | "paid" | "overdue" | "void";
  paymentTerms: PaymentTerms;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
  }>;
  payments: Array<{
    date: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
  }>;
  journalEntryId?: string;
  notes?: string;
  tags: string[];
};

// Account payable invoice
export type AccountPayable = BaseEntity & {
  invoiceNumber: string;
  vendorId: string;
  vendor?: Vendor;
  date: string;
  dueDate: string;
  amount: number;
  balance: number;
  status: "open" | "partial" | "paid" | "overdue" | "void";
  paymentTerms: PaymentTerms;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
  }>;
  payments: Array<{
    date: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
  }>;
  journalEntryId?: string;
  notes?: string;
  tags: string[];
};

// Aging bucket type
export type AgingBucket = "current" | "1-30" | "31-60" | "61-90" | "90+";

// Aging report item
export type AgingReportItem = {
  entityId: string;
  entityName: string;
  totalAmount: number;
  buckets: Record<AgingBucket, number>;
};
