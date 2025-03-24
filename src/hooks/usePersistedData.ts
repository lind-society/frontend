import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

// Create a cookie storage adapter
const sessionStorageProvider: PersistStorage<any> = {
  getItem: (name) => {
    const item = sessionStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
};

// Generic store state interface
interface DataStoreState<T> {
  data: Partial<T>;
  setData: (newData: Partial<T>) => void;
  updateField: <K extends keyof T>(key: K, value: T[K]) => void;
  clearData: () => void;
}

// Create a function that returns a typed store with a dynamic name
export function usePersistentData<T>(storeName: string) {
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
        storage: sessionStorageProvider,
      }
    )
  );
}
