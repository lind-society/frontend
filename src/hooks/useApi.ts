import axios from "axios";

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { baseApiURL } from "../static";
import { Payload } from "../types";
import { API } from "../utils/api";

interface FetchOptions<T> {
  key: QueryKey;
  url: string;
  params?: Record<string, any>;
  gcTime?: number;
  staleTime?: number;
  enabled?: boolean;
  select?: (data: any) => T;
}

const GC_TIME = 3 * 60 * 60 * 1000;
const STALE_TIME = 2 * 60 * 60 * 1000;

// Fetch all items
export const useGetApi = <T>({ key, url, params, gcTime = GC_TIME, staleTime = STALE_TIME, enabled = true, select }: FetchOptions<T>) => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await axios.get(`${baseApiURL}/${url}`, { params });
      return data;
    },
    gcTime,
    staleTime,
    enabled,
    select,
  });
};

export const useGetApiWithAuth = <T>({ key, url, params }: { key: QueryKey; url: string; params?: Record<string, any> }) => {
  return useQuery<T | undefined>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await API.get<T>(url, { params });
      return data;
    },
    gcTime: 300000,
    staleTime: 60000,
    enabled: true,
  });
};

// Create a new item
export const useCreateApi = <T>({ key, url, redirectPath }: { url: string; key: QueryKey; redirectPath?: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: T) => {
      try {
        const { data } = await API.post<Payload<string>>(`${baseApiURL}/${url}`, newItem);
        toast.success(data.message || "Success adding data");
        if (redirectPath) {
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = redirectPath;
          }, 1000);
          return;
        }
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            throw new Error(responseData.data[0]);
          }
          throw new Error(responseData?.message || "Failed to adding data");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      return;
    },
  });
};

// Update an item
export const useUpdateApi = <T>({ key, url, redirectPath }: { url: string; key: QueryKey; redirectPath?: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedItem }: { id: string; updatedItem: T }) => {
      try {
        const { data } = await API.patch<Payload<string>>(`${baseApiURL}/${url}/${id}`, updatedItem);
        toast.success(data.message || "Success updating data");
        if (redirectPath) {
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = redirectPath;
          }, 1000);
          return;
        }
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            throw new Error(responseData.data[0]);
          }
          throw new Error(responseData?.message || "Failed to updating data");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    },
  });
};

// Delete an item
export const useDeleteApi = ({ key, url, redirectPath }: { url: string; key: QueryKey; redirectPath?: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await API.delete<Payload<string>>(`${baseApiURL}/${url}/${id}`);
        toast.success(data.message || "Success deleting data");
        if (redirectPath) {
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1000);
          return;
        }
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            throw new Error(responseData.data[0]);
          }
          throw new Error(responseData?.message || "Failed to deleting data");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    },
  });
};
