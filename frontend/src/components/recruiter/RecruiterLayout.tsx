import type { ReactNode } from "react";

interface RecruiterLayoutProps {
  hero: ReactNode;
  children: ReactNode;
}

/** Page shell for every authenticated Recruiter/Agency screen: hero region + content well. */
export function RecruiterLayout({ hero, children }: RecruiterLayoutProps) {
  return (
    <div className="min-h-dvh bg-grey-100">
      {hero}
      <main className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-14">{children}</main>
    </div>
  );
}
