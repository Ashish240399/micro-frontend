import { useState, useEffect } from "react";

/**
 * Delays updating the returned value until `delay` ms have passed
 * since the last change to `value`.
 *
 * Use it to avoid firing expensive operations (API calls, heavy filters)
 * on every keystroke.
 *
 * @example
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 400);
 *
 * // Only fires when the user stops typing for 400 ms
 * const { data } = useFetch(`/users?q=${debouncedSearch}`);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
