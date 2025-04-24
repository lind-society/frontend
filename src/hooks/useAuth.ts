import axios from "axios";

import Cookies from "universal-cookie";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Payload } from "../types";
import { API } from "../utils/api";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const TOKEN_KEY = "lind_auth_token";
const USER_KEY = "lind_user";
const baseApiURL = "https://lind-society.duckdns.org/api/v1";

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
      await API.post(`${baseApiURL}/auth/logout`);
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
