import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

// ─── Create the shared Axios instance ────────────────────────────────────────

export const api: AxiosInstance = axios.create({
  /**
   * Set VITE_API_URL in each app's .env file:
   *   VITE_API_URL=http://localhost:8080/api
   *
   * Falls back to localhost:8080 in development.
   */
  baseURL:
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
    "http://localhost:8080/api",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request interceptor — attach auth token ─────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — normalise errors ─────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear storage and redirect to login.
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("[api] Forbidden — insufficient permissions.");
    }

    if (status === 500) {
      console.error("[api] Internal server error:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

// ─── Convenience helpers ──────────────────────────────────────────────────────

/** Set or clear the auth token used by all requests. */
export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export * from "./types.js";
