import axios from "axios";

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { API } from "../utils/api";

import { Payload } from "../types";

interface FetchOptions<T> {
  key: QueryKey;
  url: string;
  params?: Record<string, any>;
  gcTime?: number;
  staleTime?: number;
  enabled?: boolean;
  select?: (data: any) => T;
}

// Admin data changes constantly, and mutations already invalidate their query
// keys. A 6-hour staleTime meant a record created in one tab stayed invisible in
// another for the rest of the day — including right after seeding the database.
const GC_TIME = 30 * 60 * 1000;
const STALE_TIME = 60 * 1000;

// Fetch all items
//
// Uses the `API` instance (attaches the admin's JWT via cookie, when present)
// rather than bare axios. Most callers hit public GET endpoints where that
// header is simply ignored, but protected ones — e.g. `/bookings`, guarded by
// JwtAuthGuard with no @Public() override — used to 401 on every request
// because bare axios never sent a token at all. Rent & Order management were
// unusable for exactly this reason.
export const useGetApi = <T>({ key, url, params, gcTime = GC_TIME, staleTime = STALE_TIME, enabled = true, select }: FetchOptions<T>) => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await API.get(url, { params });
      return data;
    },
    gcTime,
    staleTime,
    enabled,
    select,
  });
};

export const useGetApiWithAuth = <T>({ key, url, params, enabled = true }: { key: QueryKey; url: string; params?: Record<string, any>; enabled?: boolean }) => {
  return useQuery<T | undefined>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await API.get<T>(url, { params });
      return data;
    },
    gcTime: 300000,
    staleTime: 60000,
    enabled,
  });
};

// Create a new item
//
// redirectPath used to be a full `window.location.href` reload (with a 1s
// delay so the success toast was visible first) — every "Save" flashed a
// blank white page and re-booted the whole SPA. It now navigates client-side
// instead, so the toast (mounted once at the app root) survives the route
// change on its own and there's nothing left to delay for.
export const useCreateApi = <T>({ key, url, redirectPath }: { url: string; key: QueryKey; redirectPath?: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (newItem: T) => {
      try {
        const { data } = await API.post<Payload<string>>(url, newItem);
        toast.success(data.message || "Success adding data");
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            throw new Error(responseData.data[0].message[0]);
          }
          throw new Error(responseData?.message || "Failed to adding data");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      if (redirectPath) {
        sessionStorage.clear();
        navigate(redirectPath);
      }
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
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ id, updatedItem }: { id: string; updatedItem: T }) => {
      try {
        const { data } = await API.patch<Payload<string>>(`${url}/${id}`, updatedItem);
        toast.success(data.message || "Success updating data");
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            throw new Error(responseData.data[0].message[0]);
          }
          throw new Error(responseData?.message || "Failed to updating data");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      if (redirectPath) {
        sessionStorage.clear();
        navigate(redirectPath);
      }
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
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data } = await API.delete<Payload<string>>(`${url}/${id}`);
        toast.success(data.message || "Success deleting data");
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (responseData?.data) {
            throw new Error(responseData.data[0].message[0]);
          }
          throw new Error(responseData?.message || "Failed to deleting data");
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
      if (redirectPath) {
        navigate(redirectPath);
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
    },
  });
};
