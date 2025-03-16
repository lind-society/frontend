import axios from "axios";

import { useQuery, QueryKey } from "@tanstack/react-query";

interface FetchOptions<T> {
  key: QueryKey;
  url: string;
  gcTime?: number;
  staleTime?: number;
  enabled?: boolean;
  select?: (data: any) => T;
}

export const useGetApi = <T = any>({
  key,
  url,
  gcTime = 300000, // Default: 5 minutes
  staleTime = 60000, // Default: 1 minute
  enabled = true,
  select,
}: FetchOptions<T>) => {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await axios.get(url);
      return data;
    },
    gcTime,
    staleTime,
    enabled,
    select,
  });
};
