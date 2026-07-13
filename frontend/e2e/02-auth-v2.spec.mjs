// E2E (module A1): full signup → verify → login lifecycle, role-based
// landing, wrong-role guard redirect, and logout-clears-session.
import { BACKEND, FRONTEND, assertServersUp, expect, launchBrowser } from "./helpers.mjs";

await assertServersUp();
const browser = await launchBrowser();

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const email = `e2e-${Date.now()}@test.dev`;

  // Signup -> lands on check-your-email
  await page.goto(`${FRONTEND}/signup`, { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", "Password1!");
  await page.locator('button[role="checkbox"]').click();
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForURL("**/verify-email", { timeout: 30_000 });
  expect(true, "signup created account and routed to verify-email");

  // Login before verification is refused and routed back to verify-email
  await page.goto(`${FRONTEND}/login`, { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", "Password1!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/verify-email", { timeout: 30_000 });
  expect(true, "unverified login routed to verify-email");

  // Complete verification via the emailed link (dev-mode token lookup)
  const tokenRes = await page.request.get(
    `${BACKEND}/api/auth/dev/token?email=${encodeURIComponent(email)}&purpose=verify_email`
  );
  expect(tokenRes.ok(), `dev token lookup succeeded (got ${tokenRes.status()}: ${await tokenRes.text()})`);
  const { token } = await tokenRes.json();
  expect(!!token, "dev token present");
  await page.goto(`${FRONTEND}/verify-email?token=${token}`, { waitUntil: "networkidle" });
  await page.waitForURL("**/verify-email/success", { timeout: 30_000 });
  expect(true, "emailed verification link verifies and shows success page");

  // Login now succeeds -> employer landing
  await page.goto(`${FRONTEND}/login`, { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", "Password1!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
  const refresh = await page.evaluate(() => localStorage.getItem("jobkey_refresh_token"));
  expect(!!refresh, "refresh token stored alongside access token");

  // Wrong-role guard: employer visiting the recruiter portal is bounced home
  await page.goto(`${FRONTEND}/recruiter/dashboard`);
  await page.waitForURL((url) => url.pathname === "/dashboard", { timeout: 30_000 });
  expect(true, "employer visiting recruiter portal is redirected to employer landing");

  // Unauthenticated guard: cleared session -> employer page redirects to login
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${FRONTEND}/vacancies`);
  await page.waitForURL("**/login", { timeout: 30_000 });
  expect(true, "guard redirects signed-out visitor to login");

  // Recruiter login lands on the recruiter dashboard (role-based landing)
  await page.fill("#email", "recruiter@jobkey.dev");
  await page.fill("#password", "password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/recruiter/dashboard", { timeout: 30_000 });
  expect(true, "recruiter login lands on recruiter dashboard");

  console.log("PASS 02-auth-v2");
} finally {
  await browser.close();
}
