import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

// Create dynamic storage provider
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

// Generic store state interface
interface DataStoreState<T> {
  data: Partial<T>;
  setData: (newData: Partial<T>) => void;
  updateField: <K extends keyof T>(key: K, value: T[K]) => void;
  clearData: () => void;
}

// Create a function that returns a typed store with a dynamic name and storage type
export function usePersistentData<T>(storeName: string, storageType: "localStorage" | "sessionStorage" = "sessionStorage") {
  return create<DataStoreState<T>>()(
    persist(
      (set) => ({
        data: {},
        setData: (newData) =>
          set((state) => ({
            data: { ...state.data, ...newData },
          })),
        updateField: (key, value) =>
          set((state) => ({
            data: {
              ...state.data,
              [key]: value,
            },
          })),
        clearData: () => set({ data: {} }),
      }),
      {
        name: storeName,
        storage: createStorageProvider(storageType),
      }
    )
  );
}
