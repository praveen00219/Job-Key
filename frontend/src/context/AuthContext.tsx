import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  apiFetch,
  ApiError,
  clearTokens,
  getToken,
  setTokens,
  SESSION_EXPIRED_EVENT,
} from "@/lib/api";

/**
 * Authentication backed by the real FastAPI backend (module A1): verified
 * email required to log in, short-lived access tokens with rotating refresh
 * tokens, and role-aware sessions consumed by the route guards.
 */

export type Role = "employer" | "recruiter" | "candidate" | "admin";

export interface AuthUser {
  email: string;
  role: Role;
}

export type LoginStatus = "success" | "invalid" | "locked" | "unverified";

export interface LoginOutcome {
  status: LoginStatus;
  role?: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial token→session check is in flight on load. */
  isLoading: boolean;
  /** True when the last session ended by expiry (login page shows a notice). */
  sessionExpired: boolean;
  /** Email carried between screens (signup → check-your-email, forgot → sent). */
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<LoginOutcome>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

interface MeResponse {
  email: string;
  role: Role;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  role: Role;
  email: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Only "loading" when there is actually a stored token to re-validate
  // (lazy initializer also keeps SSR/prerender safe — no window access on server).
  const [isLoading, setIsLoading] = useState(
    () => typeof window !== "undefined" && getToken() !== null
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Restore session from a stored token on first load.
  useEffect(() => {
    if (!getToken()) return;
    apiFetch<MeResponse>("/auth/me")
      .then((me) => setUser({ email: me.email, role: me.role }))
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  // apiFetch fires this when a 401 couldn't be healed by token rotation.
  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setSessionExpired(true);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role: "employer" }),
    });
    setPendingEmail(email);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginOutcome> => {
    try {
      const res = await apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setTokens(res.access_token, res.refresh_token);
      setUser({ email: res.email, role: res.role });
      setSessionExpired(false);
      return { status: "success", role: res.role };
    } catch (err) {
      if (err instanceof ApiError && err.status === 423) return { status: "locked" };
      if (err instanceof ApiError && err.status === 403) return { status: "unverified" };
      return { status: "invalid" };
    }
  }, []);

  const logout = useCallback(() => {
    // Best-effort server-side refresh-token revocation; local session ends now.
    apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearTokens();
    setUser(null);
    setSessionExpired(false);
  }, []);

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      await apiFetch("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) });
      return true;
    } catch {
      return false;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setPendingEmail(email);
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password: password }),
    });
  }, []);

  const resendVerification = useCallback(async () => {
    if (!pendingEmail) return;
    await apiFetch("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email: pendingEmail }),
    });
  }, [pendingEmail]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      sessionExpired,
      pendingEmail,
      setPendingEmail,
      signup,
      login,
      logout,
      verifyEmail,
      requestPasswordReset,
      resetPassword,
      resendVerification,
    }),
    [
      user,
      isLoading,
      sessionExpired,
      pendingEmail,
      signup,
      login,
      logout,
      verifyEmail,
      requestPasswordReset,
      resetPassword,
      resendVerification,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
