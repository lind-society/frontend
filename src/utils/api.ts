import axios from "axios";
import Cookies from "universal-cookie";

export const API_URL = import.meta.env.VITE_BASE_API_URL || import.meta.env.VITE_SECONDARY_API_URL;
export const TOKEN_KEY = "lind_auth_token";
export const USER_KEY = "lind_user";

const cookies = new Cookies();

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
