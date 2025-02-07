import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type {
  Vendor,
  VendorStatus,
  VendorCategory,
  PaymentTerms,
} from "../types/vendor";
import type { Address } from "../types/customer";

// Vendor specific state
type VendorState = BaseState<Vendor> & {
  vendorsByStatus: Record<VendorStatus, string[]>;
  vendorsByCategory: Record<VendorCategory, string[]>;
  totalVendors: number;
  activeVendors: number;
  totalPayables: number;
  defaultAddresses: Record<string, Address>;
};

// Initialize state
const initialState: Partial<VendorState> = {
  items: {},
  vendorsByStatus: {
    active: [],
    inactive: [],
    blocked: [],
  },
  vendorsByCategory: {
    supplier: [],
    manufacturer: [],
    distributor: [],
    service: [],
  },
  totalVendors: 0,
  activeVendors: 0,
  totalPayables: 0,
  defaultAddresses: {},
};

// Create the store with type
export const vendorStore = createDomainStore<Vendor>(
  "vendors",
  initialState,
) as unknown as Observable<VendorState>;

// Computed values
export const vendorsByStatus = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() ?? {});
  return vendors.reduce(
    (acc, vendor) => {
      const status = vendor.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(vendor.id);
      return acc;
    },
    {} as Record<VendorStatus, string[]>,
  );
});

export const vendorsByCategory = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() ?? {});
  return vendors.reduce(
    (acc, vendor) => {
      const category = vendor.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(vendor.id);
      return acc;
    },
    {} as Record<VendorCategory, string[]>,
  );
});

export const defaultAddresses = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() ?? {});
  return vendors.reduce(
    (acc, vendor) => {
      const defaultAddress = vendor.addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        acc[vendor.id] = defaultAddress;
      }
      return acc;
    },
    {} as Record<string, Address>,
  );
});

export const vendorMetrics = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() ?? {});
  return vendors.reduce(
    (metrics, vendor) => {
      metrics.total++;
      if (vendor.status === "active") {
        metrics.active++;
      }
      metrics.totalPayables += vendor.balance;
      return metrics;
    },
    { total: 0, active: 0, totalPayables: 0 },
  );
});

export const recentVendors = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() ?? {});
  return vendors
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);
});

export const vendorsByBalance = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() ?? {});
  return vendors
    .filter((vendor) => vendor.balance > 0)
    .sort((a, b) => b.balance - a.balance);
});

// Actions
export const vendorActions = {
  addVendor: (vendor: Vendor) => {
    const items = vendorStore.items.peek() ?? {};
    vendorStore.items.set({ ...items, [vendor.id]: vendor });

    // Update status indexes
    const vendorsByStatus = vendorStore.vendorsByStatus.peek() ?? {};
    const currentStatusVendors = vendorsByStatus[vendor.status] ?? [];
    vendorsByStatus[vendor.status] = [...currentStatusVendors, vendor.id];
    vendorStore.vendorsByStatus.set(vendorsByStatus);

    // Update category indexes
    const vendorsByCategory = vendorStore.vendorsByCategory.peek() ?? {};
    const currentCategoryVendors = vendorsByCategory[vendor.category] ?? [];
    vendorsByCategory[vendor.category] = [...currentCategoryVendors, vendor.id];
    vendorStore.vendorsByCategory.set(vendorsByCategory);

    // Update default address if exists
    const defaultAddress = vendor.addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      const defaultAddresses = vendorStore.defaultAddresses.peek() ?? {};
      defaultAddresses[vendor.id] = defaultAddress;
      vendorStore.defaultAddresses.set(defaultAddresses);
    }
  },

  updateVendor: (id: string, updates: Partial<Vendor>) => {
    const items = vendorStore.items.peek() ?? {};
    const current = items[id];
    if (current) {
      const updated = { ...current, ...updates };
      vendorStore.items.set({ ...items, [id]: updated });

      // Update status indexes if status changed
      if (updates.status && updates.status !== current.status) {
        const vendorsByStatus = vendorStore.vendorsByStatus.peek() ?? {};
        const currentStatusVendors = vendorsByStatus[current.status] ?? [];
        const newStatusVendors = vendorsByStatus[updates.status] ?? [];

        vendorsByStatus[current.status] = currentStatusVendors.filter(
          (vendorId) => vendorId !== id,
        );
        vendorsByStatus[updates.status] = [...newStatusVendors, id];
        vendorStore.vendorsByStatus.set(vendorsByStatus);
      }

      // Update category indexes if category changed
      if (updates.category && updates.category !== current.category) {
        const vendorsByCategory = vendorStore.vendorsByCategory.peek() ?? {};
        const currentCategoryVendors =
          vendorsByCategory[current.category] ?? [];
        const newCategoryVendors = vendorsByCategory[updates.category] ?? [];

        vendorsByCategory[current.category] = currentCategoryVendors.filter(
          (vendorId) => vendorId !== id,
        );
        vendorsByCategory[updates.category] = [...newCategoryVendors, id];
        vendorStore.vendorsByCategory.set(vendorsByCategory);
      }

      // Update default address if addresses changed
      if (updates.addresses) {
        const defaultAddress = updates.addresses.find((addr) => addr.isDefault);
        const defaultAddresses = vendorStore.defaultAddresses.peek() ?? {};
        if (defaultAddress) {
          defaultAddresses[id] = defaultAddress;
        } else {
          delete defaultAddresses[id];
        }
        vendorStore.defaultAddresses.set(defaultAddresses);
      }
    }
  },

  deleteVendor: (id: string) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor) {
      // Remove from main items
      delete items[id];
      vendorStore.items.set(items);

      // Remove from status indexes
      const vendorsByStatus = vendorStore.vendorsByStatus.peek() ?? {};
      const currentStatusVendors = vendorsByStatus[vendor.status] ?? [];
      vendorsByStatus[vendor.status] = currentStatusVendors.filter(
        (vendorId) => vendorId !== id,
      );
      vendorStore.vendorsByStatus.set(vendorsByStatus);

      // Remove from category indexes
      const vendorsByCategory = vendorStore.vendorsByCategory.peek() ?? {};
      const currentCategoryVendors = vendorsByCategory[vendor.category] ?? [];
      vendorsByCategory[vendor.category] = currentCategoryVendors.filter(
        (vendorId) => vendorId !== id,
      );
      vendorStore.vendorsByCategory.set(vendorsByCategory);

      // Remove from default addresses
      const defaultAddresses = vendorStore.defaultAddresses.peek() ?? {};
      delete defaultAddresses[id];
      vendorStore.defaultAddresses.set(defaultAddresses);
    }
  },

  updateBalance: (id: string, amount: number) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor) {
      vendorActions.updateVendor(id, {
        balance: vendor.balance + amount,
      });
    }
  },

  updateCreditLimit: (id: string, limit: number) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor) {
      vendorActions.updateVendor(id, {
        creditLimit: limit,
      });
    }
  },

  updatePaymentTerms: (id: string, terms: PaymentTerms) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor) {
      vendorActions.updateVendor(id, {
        paymentTerms: terms,
      });
    }
  },

  updateLeadTime: (id: string, days: number) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor) {
      vendorActions.updateVendor(id, {
        leadTime: days,
      });
    }
  },

  addAddress: (id: string, address: Address) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor) {
      const addresses = [...vendor.addresses];
      if (address.isDefault) {
        // Remove default flag from other addresses
        addresses.forEach((addr) => (addr.isDefault = false));
      }
      addresses.push(address);
      vendorActions.updateVendor(id, { addresses });
    }
  },

  updateAddress: (
    id: string,
    addressIndex: number,
    updates: Partial<Omit<Address, "type">> & { type?: Address["type"] },
  ) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor?.addresses[addressIndex]) {
      const addresses = [...vendor.addresses];
      if (updates.isDefault) {
        // Remove default flag from other addresses
        addresses.forEach((addr) => (addr.isDefault = false));
      }
      addresses[addressIndex] = {
        ...addresses[addressIndex],
        ...updates,
      } as Address;
      vendorActions.updateVendor(id, { addresses });
    }
  },

  removeAddress: (id: string, addressIndex: number) => {
    const items = vendorStore.items.peek() ?? {};
    const vendor = items[id];
    if (vendor?.addresses[addressIndex]) {
      const addresses = vendor.addresses.filter(
        (_, index) => index !== addressIndex,
      );
      vendorActions.updateVendor(id, { addresses });
    }
  },
};
