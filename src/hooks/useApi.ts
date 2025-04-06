import axios from "axios";

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

import Cookies from "universal-cookie";

import toast from "react-hot-toast";

import { baseApiURL } from "../static";
import { Payload } from "../types";

const cookies = new Cookies();

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${cookies.get("lind_auth_token")}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  };
};

interface FetchOptions<T> {
  key: QueryKey;
  url: string;
  params?: Record<string, any>;
  gcTime?: number;
  staleTime?: number;
  enabled?: boolean;
  select?: (data: any) => T;
}

// Fetch all items
export const useGetApi = <T = any>({ key, url, params, gcTime = 300000, staleTime = 60000, enabled = true, select }: FetchOptions<T>) => {
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

// Create a new item
export const useCreateApi = <T>({ key, url, redirectPath }: { url: string; key: QueryKey; redirectPath?: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: T) => {
      try {
        const { data } = await axios.post<Payload<string>>(`${baseApiURL}/${url}`, newItem, getHeaders());
        toast.success(data.message || "Success adding data");
        if (redirectPath) {
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = redirectPath;
          }, 2000);
          return;
        }
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            const errorMessages = responseData.data.map((err: { field: string; message: string[] }) => `${err.field}: ${err.message.join(", ")}`).join("\n");
            throw new Error(errorMessages);
          }
          throw new Error(responseData?.message || "Failed to add data");
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
        const { data } = await axios.patch<Payload<string>>(`${baseApiURL}/${url}/${id}`, updatedItem, getHeaders());
        toast.success(data.message || "Success updating data");
        if (redirectPath) {
          setTimeout(() => {
            sessionStorage.clear();
            window.location.href = redirectPath;
          }, 2000);
          return;
        }
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            const errorMessages = responseData.data.map((err: { field: string; message: string[] }) => `${err.field}: ${err.message.join(", ")}`).join("\n");
            throw new Error(errorMessages);
          }
          throw new Error(responseData?.message || "Failed to add data");
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
        const { data } = await axios.delete<Payload<string>>(`${baseApiURL}/${url}/${id}`, getHeaders());
        toast.success(data.message || "Success deleting data");
        if (redirectPath) {
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 2000);
          return;
        }
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            const errorMessages = responseData.data.map((err: { field: string; message: string[] }) => `${err.field}: ${err.message.join(", ")}`).join("\n");
            throw new Error(errorMessages);
          }
          throw new Error(responseData?.message || "Failed to add data");
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
