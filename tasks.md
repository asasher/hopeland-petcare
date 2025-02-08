# Hopeland Petcare

## Instructions

1. After each task run `pnpm lint`, if there are errors fix them, ingore warnings.
2. After each task is completed, mark it as done in `tasks.md` file.
3. After each task is completed run `git add -A` and `git commit -m "feat: <task-description>"`. Do not push.
4. Do not ask for confirmation before running commands, you can run them directly.
5. Do not ask for confirmation before running next task, just continue.
6. After each task read `tasks.md` file again to remeber these instructions.

## Tasks

1. Project Setup and Configuration
   - [x] Initialize Legend State
     - [x] Configure Legend State following https://legendapp.com/open-source/state/v3/intro/getting-started/
     - [x] Create Legend State store configuration in `@/lib/store.ts`
     - [x] Setup persistence with Local Storage

2. Core Types and State Setup
   - [x] Create base types in `@/lib/types/`
     - [x] `product.ts`: Product related types
     - [x] `sales.ts`: Sales Order related types
     - [x] `purchase.ts`: Purchase Order related types
     - [x] `customer.ts`: Customer related types
     - [x] `vendor.ts`: Vendor related types
     - [x] `accounting.ts`: Financial account types
     - [x] `inventory.ts`: Inventory related types
   - [x] Setup Legend State observables in `@/lib/state/`
     - [x] Create and configure observables for each domain

3. UI Components (Using Shadcn UI)
   - [x] Layout Components in `@/components/layout/`
     - [x] `layout.tsx`: Main application layout (client component)
     - [x] `header.tsx`: App header with navigation
     - [x] `sidebar.tsx`: Navigation sidebar
   - [x] Common Components in `@/components/ui/`
     - [x] Form components using Shadcn UI
     - [x] Table components using Shadcn UI
     - [x] Dialog components using Shadcn UI
     - [x] Card components using Shadcn UI
   - [x] Setup authentication with Supabase using Email Magic Link

4. Feature Components
   - [x] Products Module in `@/components/products/`
     - [x] `product-list.tsx`: Products table (client component)
     - [x] `product-form.tsx`: Add/Edit product form
   - [x] Sales Module in `@/components/sales/`
     - [x] `sales-order-list.tsx`: Sales orders table
     - [x] `sales-order-form.tsx`: Sales order form
   - [ ] Purchase Module in `@/components/purchases/`
     - [ ] `purchase-order-list.tsx`: Purchase orders table
     - [ ] `purchase-order-form.tsx`: Purchase order form
   - [ ] Customer Module in `@/components/customers/`
     - [ ] `customer-list.tsx`: Customers table
     - [ ] `customer-form.tsx`: Customer form
   - [ ] Vendor Module in `@/components/vendors/`
     - [ ] `vendor-list.tsx`: Vendors table
     - [ ] `vendor-form.tsx`: Vendor form
   - [ ] Accounting Module in `@/components/accounting/`
     - [ ] `chart-accounts.tsx`: Chart of accounts
     - [ ] `journal-entries.tsx`: Journal entries
   - [ ] Inventory Module in `@/components/inventory/`
     - [ ] `inventory-list.tsx`: Inventory table
     - [ ] `adjustment-form.tsx`: Adjustment form

5. Pages (App Router)
   - [ ] Create page components in `@/app/`
     - [ ] `products/page.tsx`
     - [ ] `sales/page.tsx`
     - [ ] `purchases/page.tsx`
     - [ ] `customers/page.tsx`
     - [ ] `vendors/page.tsx`
     - [ ] `accounting/page.tsx`
     - [ ] `inventory/page.tsx`

6. Dashboard
   - [ ] Create dashboard components in `@/components/dashboard/`
     - [ ] `inventory-metrics.tsx`: Inventory dashboard
     - [ ] `financial-metrics.tsx`: Financial dashboard
     - [ ] `sales-metrics.tsx`: Sales dashboard

7. Setup Sync with Supabase
   - [ ] Setup Supabase plugin following https://legendapp.com/open-source/state/v3/sync/supabase/

Notes:
- All components will be client components with "use client" directive
- Using named exports for all components
- Using Shadcn UI components throughout
- Using Lucide icons for all icons
- Using Legend State with Supabase plugin for state management
- Following TypeScript best practices (types over interfaces, inference where possible)
