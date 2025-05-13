import axios from "axios";

import Cookies from "universal-cookie";

import { API, API_URL, TOKEN_KEY, USER_KEY } from "../utils/api";

import { Payload } from "../types";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const COOKIES_CONFIG = { path: "/", expires: new Date(Date.now() + 21600000), secure: true, sameSite: "strict" as "strict" };

const cookies = new Cookies();

export const authentication = {
  login: async (identifier: string, password: string): Promise<Payload<AuthResponse>> => {
    try {
      const { data } = await axios.post<Payload<AuthResponse>>(`${API_URL}/auth/login`, { identifier, password }, { headers: { "Content-Type": "application/json" } });
      cookies.set(TOKEN_KEY, data.data.accessToken || "", COOKIES_CONFIG);
      cookies.set(USER_KEY, identifier, COOKIES_CONFIG);
      window.location.href = "/dashboard/main";
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout: async () => {
    try {
      await API.post(`${API_URL}/auth/logout`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed");
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
