import type { ReactNode } from "react";

interface EmployerLayoutProps {
  hero: ReactNode;
  children: ReactNode;
}

/** Page shell for every authenticated Employer screen: hero region + content well. */
export function EmployerLayout({ hero, children }: EmployerLayoutProps) {
  return (
    <div className="min-h-dvh bg-grey-100">
      {hero}
      <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-14">{children}</main>
    </div>
  );
}
