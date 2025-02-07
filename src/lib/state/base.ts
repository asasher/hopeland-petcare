import { observable } from "@legendapp/state";
import { configureSynced } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

// Common state types
export type LoadingState = {
  loading: boolean;
  error: string | null;
};

export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};

export type FilterState = {
  search: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters: Record<string, unknown>;
};

// Base state type for all domains
export type BaseState<T> = LoadingState & {
  items: Record<string, T>;
  selected: string | null;
  pagination: PaginationState;
  filter: FilterState;
};

// Configure persistence
export const configurePersistence = configureSynced({
  persist: {
    plugin: ObservablePersistLocalStorage,
  },
});

// Create a base observable state
export function createBaseState<T>(
  name: string,
  initialState?: Partial<BaseState<T>>,
): BaseState<T> {
  return configurePersistence({
    initial: {
      items: {},
      selected: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      filter: {
        search: "",
        filters: {},
      },
      ...initialState,
    },
    persist: { name },
  });
}

// Create a base observable
export function createDomainStore<T>(
  name: string,
  initialState?: Partial<BaseState<T>>,
) {
  const state = createBaseState<T>(name, initialState);
  return observable(state);
}
