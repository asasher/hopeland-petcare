import { observable } from "@legendapp/state";

// Base state type for all domains
export type BaseState<T> = {
  items: Record<string, T>;
};

// Create domain store
export function createDomainStore<T>(
  name: string,
  initialState: Partial<BaseState<T>>,
) {
  const store = observable({
    items: {} as Record<string, T>,
    ...initialState,
  });

  return store;
}

// Helper to initialize store with mock data
export function initializeStoreWithMockData<T>(
  store: {
    items: {
      get: () => Record<string, T>;
      set: (data: Record<string, T>) => void;
    };
  },
  mockData: Record<string, T>,
) {
  const currentData = store.items.get();
  if (Object.keys(currentData).length === 0) {
    store.items.set(mockData);
  }
}
