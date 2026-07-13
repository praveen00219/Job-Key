const TOKEN_KEY = "jobkey_token";
const REFRESH_KEY = "jobkey_refresh_token";

/** Fired when a session can no longer be refreshed; AuthContext listens. */
export const SESSION_EXPIRED_EVENT = "jobkey:session-expired";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function rawFetch<T>(path: string, options: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`/api${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const message = body?.detail ?? res.statusText;
    throw new ApiError(res.status, typeof message === "string" ? message : "Request failed");
  }

  return body as T;
}

// Single-flight refresh: concurrent 401s share one rotation attempt
// (refresh tokens are single-use, so racing two would log the user out).
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const pair = await rawFetch<{ access_token: string; refresh_token: string }>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refresh }),
      });
      setTokens(pair.access_token, pair.refresh_token);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * Fetch wrapper for the FastAPI backend. On a 401 it transparently rotates
 * the refresh token and retries once; if that fails the stored session is
 * cleared and SESSION_EXPIRED_EVENT fires (route guards then redirect).
 * Errors surface as ApiError with the server's `detail` message.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    return await rawFetch<T>(path, options);
  } catch (err) {
    const isAuthCall = path.startsWith("/auth/");
    if (err instanceof ApiError && err.status === 401 && !isAuthCall && getRefreshToken()) {
      if (await tryRefresh()) {
        return rawFetch<T>(path, options);
      }
      clearTokens();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw err;
  }
}
