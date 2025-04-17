// src/services/authService.ts
import axios from "axios";
import Cookies from "universal-cookie";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseApiURL } from "../static";
import { Payload } from "../types";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const TOKEN_KEY = "lind_auth_token";
const USER_KEY = "lind_user";
const cookies = new Cookies();

export const authentication = {
  login: async (identifier: string, password: string): Promise<Payload<AuthResponse>> => {
    try {
      const response = await axios.post<Payload<AuthResponse>>(`${baseApiURL}/auth/login`, { identifier, password }, { headers: { "Content-Type": "application/json" } });

      const data = response.data;

      // Store authentication data in cookies
      cookies.set(TOKEN_KEY, data.data.accessToken || "", { path: "/", expires: new Date(Date.now() + 86400000), secure: true, sameSite: "strict" });
      cookies.set(USER_KEY, identifier, { path: "/", expires: new Date(Date.now() + 86400000), secure: true, sameSite: "strict" });

      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.data.message || "Login failed");
    }
  },

  logout: async () => {
    try {
      await axios.post(`${baseApiURL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${authentication.getToken()}` } });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.data.message || "Logout failed");
    }
    cookies.remove(TOKEN_KEY, { path: "/" });
    cookies.remove(USER_KEY, { path: "/" });
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/admin/login";
  },

  isAuthenticated: (): boolean => {
    return !!cookies.get(TOKEN_KEY);
  },

  getToken: (): string | undefined => {
    return cookies.get(TOKEN_KEY);
  },

  getUser: (): string | null => {
    const userJson = cookies.get(USER_KEY);
    return userJson ? userJson : null;
  },

  // Helper function to make authenticated API requests
  getApiWithAuth: async <T>(url: string, params?: Record<string, any>) => {
    return await axios
      .get<T>(`${baseApiURL}/${url}`, {
        headers: {
          Authorization: `Bearer ${authentication.getToken()}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        params,
      })
      .then((response) => {
        return response.data;
      });
  },
};

// React Query Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => authentication.login(identifier, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.data.accessToken);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => authentication.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["authUser"] });
    },
  });
};

export const useGetApiWithAuth = <T>({ key, url, params }: { key: QueryKey; url: string; params?: Record<string, any> }) => {
  return useQuery<T | undefined>({
    queryKey: key,
    queryFn: async () => {
      const responseProfile = await authentication.getApiWithAuth<T>(url, params);
      return responseProfile;
    },
    gcTime: 300000,
    staleTime: 60000,
    enabled: true,
  });
};
