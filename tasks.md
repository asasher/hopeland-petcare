# Hopeland Petcare Tasks

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
   - [ ] Setup Legend State observables in `@/lib/state/`
     - [ ] Create and configure observables for each domain
     - [ ] Setup Supabase sync for each observable

3. UI Components (Using Shadcn UI)
   - [ ] Layout Components in `@/components/layout/`
     - [ ] `layout.tsx`: Main application layout (client component)
     - [ ] `header.tsx`: App header with navigation
     - [ ] `sidebar.tsx`: Navigation sidebar
   - [ ] Common Components in `@/components/ui/`
     - [ ] Form components using Shadcn UI
     - [ ] Table components using Shadcn UI
     - [ ] Dialog components using Shadcn UI
     - [ ] Card components using Shadcn UI

4. Feature Components
   - [ ] Products Module in `@/components/products/`
     - [ ] `product-list.tsx`: Products table (client component)
     - [ ] `product-form.tsx`: Add/Edit product form
   - [ ] Sales Module in `@/components/sales/`
     - [ ] `sales-order-list.tsx`: Sales orders table
     - [ ] `sales-order-form.tsx`: Sales order form
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
