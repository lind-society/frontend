import axios from "axios"; // Replace with your API endpoint

import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";

import toast from "react-hot-toast";
import Cookies from "universal-cookie";

import { baseApiURL } from "../static";

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
export const useCreateApi = (url: string, key: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: Record<string, any>) => {
      const { data } = await axios.post(`${baseApiURL}/${url}`, newItem, getHeaders());
      toast("Success adding data", {
        style: { borderRadius: "5px", background: "#15803d", color: "#fff" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};

// Update an item
export const useUpdateApi = (url: string, key: QueryKey) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedItem }: { id: string; updatedItem: Record<string, any> }) => {
      const { data } = await axios.put(`${baseApiURL}/${url}/${id}`, updatedItem, getHeaders());
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
      await axios.delete(`${baseApiURL}/${url}/${id}`, getHeaders());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  });
};
