import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { apiFetch, ApiError, clearToken, getToken, setToken } from "@/lib/api";

/**
 * Employer authentication, backed by the real FastAPI backend
 * (backend/app/routers/auth.py) as of Phase 11. Recruiter and Candidate
 * portals still run on their own local mock state — only the Employer
 * flows (src/pages/auth/*) consume this context.
 */

export interface AuthUser {
  email: string;
}

export type LoginResult = "success" | "invalid" | "locked";

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial token→session check is in flight on load. */
  isLoading: boolean;
  /** Email carried between screens (e.g. signup → check-your-email, forgot → reset). */
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

interface MeResponse {
  email: string;
}

interface TokenResponse {
  access_token: string;
  role: string;
  email: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Restore session from a stored token on first load.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    apiFetch<MeResponse>("/auth/me")
      .then((me) => setUser({ email: me.email }))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role: "employer" }),
    });
    setPendingEmail(email);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(res.access_token);
      setUser({ email: res.email });
      return "success";
    } catch (err) {
      if (err instanceof ApiError && err.status === 423) return "locked";
      return "invalid";
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setPendingEmail(email);
  }, []);

  const resetPassword = useCallback(
    async (password: string) => {
      if (!pendingEmail) throw new Error("No email on file for this reset — start again from Forgot Password.");
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: pendingEmail, new_password: password }),
      });
    },
    [pendingEmail]
  );

  const resendVerification = useCallback(async () => {
    // Email delivery arrives with the Phase 12 email integration; accounts
    // are auto-verified server-side until then, so this is a no-op ping.
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      pendingEmail,
      setPendingEmail,
      signup,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
      resendVerification,
    }),
    [user, isLoading, pendingEmail, signup, login, logout, requestPasswordReset, resetPassword, resendVerification]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
