import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("pg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/deleteUser",
  "/privacy-policy",
  "/terms-and-conditions",
];

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("pg_token");
      localStorage.removeItem("pg_user");
      const currentPath = window.location.pathname;
      const isPublic = PUBLIC_PATHS.some((path) => currentPath.startsWith(path));
      if (!isPublic) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export function apiOrigin() {
  // Strip trailing /api so we can build absolute URLs for uploaded photos, e.g. /uploads/xyz.jpg
  return API_URL.replace(/\/api\/?$/, "");
}
