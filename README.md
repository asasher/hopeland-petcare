# Hopeland Pet Care

## Instructions

1. After each task
  1. Run `pnpm lint`, if there are errors fix them, ingore warnings.
  2. Mark it as done in `README.md` file, if the task is not present in the `README.md` file, add it and mark it as done.
  3. Run `git add -A` and `git commit -m "feat: <task-description>"`. Do not push.
2. After each task read `README.md` file again to remeber these instructions.

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
  - [x] vendor.ts have been update the rest of the codebase accordingly
  - [x] Move Address and Contact types to common.ts

9. Improve UI and UX
  - [x] Create a CustomerCard component, displaying all customer information with proper visual hierarchy
  - [x] Change CustomerList from DataTable to a list of cards with search and filter
  - [x] Add search bar to the top of the CustomerList with fuzzy search on each of the customer fields using fuse.js, install fuse.js if not installed using `pnpm add fuse.js`

10. Mock Data
  - [x] Create mock data for all entities
  - [x] Add mock data initialization to domain stores
  - [x] Ensure type safety for mock data

11. Settings Page
  - [x] Create settings page with application data reset functionality
  - [x] Add confirmation dialog for data reset
  - [x] Implement reset functionality to clear all domain stores

12. Simplify and clean-up the code
  - [x] I've removed accounting.ts, propogate those changes to the codebase, remove relevant pages and forms
  - [ ] I've simplified the product.ts, propogate those changes to the codebase
  - [ ] I've simplified the purchase.ts, propogate those changes to the codebase
  - [ ] I've simplified the sales.ts, propogate those changes to the codebase
  - [ ] I've simplified the customer.ts, propogate those changes to the codebase
  - [ ] I've simplified the vendor.ts, propogate those changes to the codebase
  - [ ] I've simplified the inventory.ts, propogate those changes to the codebase
  

12. Setup Sync with Supabase
   - [ ] Setup Supabase plugin following https://legendapp.com/open-source/state/v3/sync/supabase/

Notes:
- All components will be client components with "use client" directive
- Using named exports for all components
- Using Shadcn UI components throughout
- Using Lucide icons for all icons
- Using Legend State with Supabase plugin for state management
- Following TypeScript best practices (types over interfaces, inference where possible)
