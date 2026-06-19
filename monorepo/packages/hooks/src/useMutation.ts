import { useState, useCallback } from "react";
import { api } from "@repo/api";
import type { AxiosRequestConfig } from "axios";

type HttpMethod = "post" | "put" | "patch" | "delete";

interface UseMutationState<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
}

interface UseMutationResult<TData, TBody> extends UseMutationState<TData> {
  /**
   * Execute the mutation.
   * For DELETE you usually don't pass a body, for POST/PUT you do.
   */
  mutate: (body?: TBody, config?: AxiosRequestConfig) => Promise<TData>;
  /** Reset state back to initial (clears data and error) */
  reset: () => void;
}

/**
 * Execute POST, PUT, PATCH, or DELETE requests imperatively.
 *
 * @example
 * // POST
 * const { mutate, loading } = useMutation<User, CreateUserDto>("/users", "post");
 * await mutate({ name: "John", email: "john@example.com" });
 *
 * // DELETE
 * const { mutate: deleteUser } = useMutation(`/users/${id}`, "delete");
 * await deleteUser();
 */
export function useMutation<TData = unknown, TBody = unknown>(
  url: string,
  method: HttpMethod = "post"
): UseMutationResult<TData, TBody> {
  const [state, setState] = useState<UseMutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (body?: TBody, config?: AxiosRequestConfig): Promise<TData> => {
      setState({ data: null, loading: true, error: null });
      try {
        let response;
        if (method === "delete") {
          // axios.delete doesn't take a body as the second arg — pass via config
          response = await api.delete<TData>(url, { data: body, ...config });
        } else {
          response = await api[method]<TData>(url, body, config);
        }
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setState({ data: null, loading: false, error: message });
        throw err; // re-throw so callers can catch too
      }
    },
    [url, method]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}
