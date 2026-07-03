import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

/** "← Back to …" centred navigation link used on secondary auth screens. */
export function BackLink({ to, children, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-body-md font-medium text-grey-900 transition-colors hover:text-brand-600",
        className
      )}
    >
      <ArrowLeft className="size-5" />
      {children}
    </Link>
  );
}
