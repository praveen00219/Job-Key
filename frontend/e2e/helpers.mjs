// Shared helpers for the committed E2E suite (module A0).
// Local runs use the system Edge (channel msedge) via playwright-core;
// CI installs the full `playwright` package + a downloaded Chromium instead.

export const FRONTEND = process.env.E2E_FRONTEND_URL ?? "http://localhost:5173";
export const BACKEND = process.env.E2E_BACKEND_URL ?? "http://localhost:8000";

export async function launchBrowser() {
  if (process.env.CI) {
    const { chromium } = await import("playwright");
    return chromium.launch();
  }
  const { chromium } = await import("playwright-core");
  return chromium.launch({ channel: "msedge" });
}

export async function assertServersUp() {
  for (const [name, url] of [
    ["frontend", FRONTEND],
    ["backend", `${BACKEND}/api/health`],
  ]) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`status ${res.status}`);
    } catch (err) {
      throw new Error(`${name} is not reachable at ${url} — start it first (${err.message})`);
    }
  }
}

export function expect(condition, message) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}
