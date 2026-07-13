// E2E: employer login against the real backend + live vacancies list.
// Covers module A0's baseline (the flows wired in Phase 11).
import { FRONTEND, assertServersUp, expect, launchBrowser } from "./helpers.mjs";

await assertServersUp();
const browser = await launchBrowser();

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Wrong password -> inline error, stays on /login
  await page.goto(`${FRONTEND}/login`, { waitUntil: "networkidle" });
  await page.fill("#email", "employer@jobkey.dev");
  await page.fill("#password", "wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.locator("text=Invalid email or password").waitFor({ timeout: 30_000 });
  expect(page.url().endsWith("/login"), "wrong password shows error and stays on /login");

  // Correct login -> dashboard + stored JWT
  await page.fill("#password", "password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
  const token = await page.evaluate(() => localStorage.getItem("jobkey_token"));
  expect(!!token, "JWT stored after real login");

  // Vacancies list shows live data (seeded vacancy + live badge)
  await page.goto(`${FRONTEND}/vacancies`, { waitUntil: "networkidle" });
  await page.locator("text=Live from your JobKey account").waitFor({ timeout: 30_000 });
  expect(
    await page.locator("text=Senior Software Engineer").first().isVisible(),
    "seeded backend vacancy visible in the list"
  );

  // Session survives reload
  await page.reload({ waitUntil: "networkidle" });
  const tokenAfter = await page.evaluate(() => localStorage.getItem("jobkey_token"));
  expect(!!tokenAfter, "session survives reload");

  console.log("PASS 01-auth-and-vacancies");
} finally {
  await browser.close();
}
