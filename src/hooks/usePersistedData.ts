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
  clearData: (deleteData: Partial<T>) => void;
}

export function usePersistentData<T>(storeName: string, storageType: "localStorage" | "sessionStorage" = "sessionStorage") {
  return create<DataStoreState<T>>()(
    persist(
      (set) => ({
        data: {},
        setData: (newData) =>
          set((state) => ({
            data: { ...state.data, ...newData },
          })),
        clearData: (deleteData) =>
          set((state) => ({
            data: { ...state.data, ...deleteData },
          })),
      }),
      {
        name: storeName,
        storage: createStorageProvider(storageType),
      }
    )
  );
}
