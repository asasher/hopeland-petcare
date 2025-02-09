# Hopeland Pet Care

## Instructions

1. After each task run `pnpm lint`, if there are errors fix them, ingore warnings.
2. After each task is completed, mark it as done in `README.md` file.
3. After each task is completed run `git add -A` and `git commit -m "feat: <task-description>"`. Do not push.
4. Do not ask for confirmation before running commands, you can run them directly.
5. Do not ask for confirmation before running next task, just continue.
6. After each task read `README.md` file again to remeber these instructions.

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
   - [x] Purchase Module in `@/components/purchases/`
     - [x] `purchase-order-list.tsx`: Purchase orders table
     - [x] `purchase-order-form.tsx`: Purchase order form
   - [x] Customer Module in `@/components/customers/`
     - [x] `customer-list.tsx`: Customers table
     - [x] `customer-form.tsx`: Customer form
   - [x] Vendor Module in `@/components/vendors/`
     - [x] `vendor-list.tsx`: Vendors table
     - [x] `vendor-form.tsx`: Vendor form
   - [x] Accounting Module in `@/components/accounting/`
     - [x] `chart-accounts.tsx`: Chart of accounts
     - [x] `journal-entries.tsx`: Journal entries
   - [x] Inventory Module in `@/components/inventory/`
     - [x] `inventory-list.tsx`: Inventory table
     - [x] `adjustment-form.tsx`: Adjustment form

5. Pages (App Router)
   - [x] Create page components in `@/app/`
     - [x] `products/page.tsx`
     - [x] `sales/page.tsx`
     - [x] `purchases/page.tsx`
     - [x] `customers/page.tsx`
     - [x] `vendors/page.tsx`
     - [x] `accounting/page.tsx`
     - [x] `inventory/page.tsx`

6. Dashboard
   - [x] Create dashboard components in `@/components/dashboard/`
     - [x] `inventory-metrics.tsx`: Inventory dashboard
     - [x] `financial-metrics.tsx`: Financial dashboard
     - [x] `sales-metrics.tsx`: Sales dashboard
     - [x] `purchases-metrics.tsx`: Purchases dashboard
     - [x] `index.tsx`: Main dashboard component

7. Create the home page
   - [x] Create the home page in `@/app/page.tsx` with the dashboard components

8. Checkpoint
  - [x] Remove the Reports link and the reports page since we don't need it
  - [x] Run pnpm lint again and fix all errors and warnings
  - [x] Git add and commit the changes

9. Setup Sync with Supabase
   - [ ] Setup Supabase plugin following https://legendapp.com/open-source/state/v3/sync/supabase/

Notes:
- All components will be client components with "use client" directive
- Using named exports for all components
- Using Shadcn UI components throughout
- Using Lucide icons for all icons
- Using Legend State with Supabase plugin for state management
- Following TypeScript best practices (types over interfaces, inference where possible)
