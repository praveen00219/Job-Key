import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders the danger (invalid) border + focus ring. */
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          "flex h-[52px] w-full rounded-md border bg-white px-3.5 py-3 text-body-md text-grey-900 shadow-xs transition-colors",
          "placeholder:text-grey-400",
          "focus-visible:outline-none focus-visible:ring-4",
          "disabled:cursor-not-allowed disabled:bg-grey-100 disabled:text-grey-500",
          error
            ? "border-danger-300 focus-visible:border-danger-300 focus-visible:ring-danger-500/15"
            : "border-grey-200 focus-visible:border-brand-300 focus-visible:ring-brand-500/15",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
