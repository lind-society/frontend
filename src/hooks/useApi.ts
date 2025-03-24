import axios from "axios"; // Replace with your API endpoint

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

import toast from "react-hot-toast";
import Cookies from "universal-cookie";

import { baseApiURL } from "../static";
import { Payload } from "../types";

const cookies = new Cookies();

const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${cookies.get("lind_auth_token")}`,
      "Content-Type": "application/json",
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
export const useCreateApi = <T>(url: string, key: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: T) => {
      const { data } = await axios.post<Payload<string>>(`${baseApiURL}/${url}`, newItem, getHeaders());
      toast(data.message || "Success adding data", { style: { borderRadius: "5px", background: "#22c55e", color: "#fff" } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

// Update an item
export const useUpdateApi = <T>(url: string, key: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedItem }: { id: string; updatedItem: T }) => {
      const { data } = await axios.put<Payload<string>>(`${baseApiURL}/${url}/${id}`, updatedItem, getHeaders());
      toast(data.message || "Success editing data", { style: { borderRadius: "5px", background: "#0891b2", color: "#fff" } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

// Delete an item
export const useDeleteApi = (url: string, key: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete<Payload<string>>(`${baseApiURL}/${url}/${id}`, getHeaders());
      toast(data.message || "Success deleting data", { style: { borderRadius: "5px", background: "#ef4444", color: "#fff" } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};
