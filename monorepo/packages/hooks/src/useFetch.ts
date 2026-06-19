import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@repo/api";
import type { AxiosRequestConfig } from "axios";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchResult<T> extends UseFetchState<T> {
  /** Manually re-trigger the request */
  refetch: () => void;
}

/**
 * Fetch data from a GET endpoint and re-fetch when `url` or `config` changes.
 *
 * @example
 * const { data, loading, error, refetch } = useFetch<User[]>("/users");
 */
export function useFetch<T>(
  url: string,
  config?: AxiosRequestConfig
): UseFetchResult<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Keep a stable ref to config so we don't re-run on every render
  const configRef = useRef(config);
  configRef.current = config;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { data } = await api.get<T>(url, configRef.current);
      setState({ data, loading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, [url]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
