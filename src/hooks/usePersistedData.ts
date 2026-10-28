import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

const createStorageProvider = (type: "localStorage" | "sessionStorage"): PersistStorage<any> => ({
  getItem: (name) => {
    const storage = type === "localStorage" ? localStorage : sessionStorage;
    const item = storage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    const storage = type === "localStorage" ? localStorage : sessionStorage;
    storage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    const storage = type === "localStorage" ? localStorage : sessionStorage;
    storage.removeItem(name);
  },
});

interface DataStoreState<T> {
  data: Partial<T>;
  setData: (newData: Partial<T>) => void;
  clearData: () => void;
}

// Keyed by storageType+storeName so every caller asking for the same store
// (e.g. TopBar's currency picker and every page that also reads
// "selected-currency") shares one Zustand instance instead of each getting
// its own. `create()` used to run fresh on every call — a second instance on
// the same storage key would each hydrate from localStorage, write its own
// update back, and re-hydrate off the other's write, round-tripping forever
// as "Maximum update depth exceeded".
const storeCache = new Map<string, ReturnType<typeof create<DataStoreState<any>>>>();

export function usePersistentData<T>(storeName: string, storageType: "localStorage" | "sessionStorage" = "sessionStorage") {
  const cacheKey = `${storageType}:${storeName}`;
  const cached = storeCache.get(cacheKey);
  if (cached) {
    return cached as ReturnType<typeof create<DataStoreState<T>>>;
  }

  const store = create<DataStoreState<T>>()(
    persist(
      (set) => ({
        data: {},
        setData: (newData) =>
          set((state) => ({
            data: { ...state.data, ...newData },
          })),
        // `set({})` merges an empty object into state — a no-op, since zustand's
        // default `set` shallow-merges rather than replaces. The draft was never
        // actually clearable through this. `data: {}` targets the field itself.
        clearData: () => set({ data: {} }),
      }),
      {
        name: storeName,
        storage: createStorageProvider(storageType),
      }
    )
  );

  storeCache.set(cacheKey, store);
  return store;
}
