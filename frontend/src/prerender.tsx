import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { queryClient } from "./lib/queryClient";
import { publicJobs } from "./lib/mockPublicJobs";

/**
 * SSR entry used only by scripts/prerender.mjs at build time to emit static,
 * crawlable HTML for the public job pages (per the roadmap's Decision #1 —
 * the only part of the product that needs SEO). The SPA hydrates over it.
 */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </StaticRouter>
  );
}

/** Routes to prerender + their SEO meta. */
export function getPrerenderRoutes(): { path: string; title: string; description: string }[] {
  return publicJobs.map((job) => ({
    path: `/jobs/${job.slug}`,
    title: `${job.title} at ${job.company} — JobKey`,
    description: `${job.title} · ${job.employmentType} · ${job.location} · ${job.salary}. Apply on JobKey.`,
  }));
}
