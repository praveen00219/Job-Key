import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";

/**
 * Shared server-state client (module A0). Conventions for every wired page:
 * - queries go through `apiFetch` and are keyed by resource path
 * - 4xx responses never retry (they won't heal); network errors retry once
 * - 401 session-expiry redirect is layered on in module A1's route guards
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});
