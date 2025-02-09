import { computed } from "@legendapp/state";
import type { Observable } from "@legendapp/state";
import { createDomainStore } from "./base";
import type { BaseState } from "./base";
import type { Vendor } from "../types/vendor";
import type { Address } from "../types/common";

// Vendor specific state
type VendorState = BaseState<Vendor> & {
  totalVendors: number;
  activeVendors: number;
  defaultAddresses: Record<string, Address>;
};

// Initialize state
const initialState: Partial<VendorState> = {
  items: {},
  totalVendors: 0,
  activeVendors: 0,
  defaultAddresses: {},
};

// Create the store with type
export const vendorStore = createDomainStore<Vendor>(
  "vendors",
  initialState,
) as unknown as Observable<VendorState>;

// Computed values
export const activeVendors = computed(() => {
  const vendors = Object.values(vendorStore.items.peek() || {}) as Vendor[];
  return vendors.filter((vendor) => vendor.isActive);
});

// Actions
export const vendorActions = {
  addVendor: (vendor: Vendor) => {
    const items = vendorStore.items.peek() || {};
    vendorStore.items.set({ ...items, [vendor.id]: vendor });
  },

  updateVendor: (id: string, updates: Partial<Vendor>) => {
    const items = vendorStore.items.peek() || {};
    const current = items[id];
    if (current) {
      vendorStore.items.set({
        ...items,
        [id]: { ...current, ...updates },
      });
    }
  },

  deleteVendor: (id: string) => {
    const items = vendorStore.items.peek() || {};
    delete items[id];
    vendorStore.items.set(items);
  },

  updateActive: (id: string, isActive: boolean) => {
    const items = vendorStore.items.peek() || {};
    const current = items[id];
    if (current) {
      vendorStore.items.set({
        ...items,
        [id]: { ...current, isActive },
      });
    }
  },

  updateDefaultAddress: (id: string, address: Address) => {
    const addresses = vendorStore.defaultAddresses.peek() || {};
    vendorStore.defaultAddresses.set({
      ...addresses,
      [id]: address,
    });
  },
};
