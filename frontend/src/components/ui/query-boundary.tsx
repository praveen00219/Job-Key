import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { CircleAlert, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface QueryBoundaryProps<T> {
  query: UseQueryResult<T>;
  /** Render prop invoked once data is available. */
  children: (data: T) => ReactNode;
  /** Shown when data resolves to an empty list/object (optional). */
  empty?: ReactNode;
  /** Returns true when the resolved data should count as empty. */
  isEmpty?: (data: T) => boolean;
}

/**
 * Standard loading / error / empty handling for every API-wired page
 * (module A0 toolkit). Keeps pages down to `query` + happy-path markup.
 */
export function QueryBoundary<T>({ query, children, empty, isEmpty }: QueryBoundaryProps<T>) {
  if (query.isPending) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg bg-white p-16 text-grey-500">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-body-sm">Loading…</span>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-16 text-center">
        <CircleAlert className="size-8 text-danger-500" />
        <p className="text-body-md font-semibold text-grey-950">Something went wrong</p>
        <p className="max-w-[44ch] text-body-sm text-grey-500">
          {query.error instanceof Error ? query.error.message : "The request failed."}
        </p>
        <Button variant="secondary" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (isEmpty?.(query.data) && empty) return <>{empty}</>;

  return <>{children(query.data)}</>;
}
