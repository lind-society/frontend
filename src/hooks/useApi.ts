import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { baseApiURL } from "../static";

// Create axios instance with default config
const api = axios.create({
  baseURL: baseApiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Add request interceptor for auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors here (e.g., 401 Unauthorized)
//     if (error.response?.status === 401) {
//       // Redirect to login or refresh token
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// POST hook
export function usePostApi<TData = unknown, TVariables = unknown>(url: string, options?: UseMutationOptions<TData, TVariables>) {
  return useMutation<TData, TVariables>({
    mutationFn: async (variables) => {
      const response = await api.delete<TData>(
        url,
        typeof variables === "object"
          ? {
              data: variables,
            }
          : undefined
      );
      return response.data;
    },
    ...options,
  });
}
