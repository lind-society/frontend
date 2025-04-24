import axios from "axios";
import Cookies from "universal-cookie";

const API_URL = "https://lind-society.duckdns.org/api/v1";

const cookies = new Cookies();

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${cookies.get("lind_auth_token")}`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: true,
});
