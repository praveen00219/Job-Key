import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Mock authentication layer for the frontend-only phase. Every method is an
 * async stub with a simulated latency and in-memory state. When the backend is
 * ready, replace the bodies marked `// TODO: replace with API call` with real
 * fetch/axios calls — the surface (types + return values) is designed to stay
 * the same so pages don't need to change.
 */

export interface AuthUser {
  email: string;
}

export type LoginResult = "success" | "invalid" | "locked";

interface AuthContextValue {
  user: AuthUser | null;
  /** Email carried between screens (e.g. signup → check-your-email). */
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  resendVerification: () => Promise<void>;
}

// Demo account so the happy path is reachable without a backend.
const DEMO_EMAIL = "demo@jobkey.com";
const DEMO_PASSWORD = "Password1!";
const MAX_ATTEMPTS = 5;

const delay = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const signup = useCallback(async (email: string, _password: string) => {
    // TODO: replace with API call (POST /auth/register)
    await delay();
    setPendingEmail(email);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      // TODO: replace with API call (POST /auth/login)
      await delay();

      if (failedAttempts >= MAX_ATTEMPTS) return "locked";

      const ok =
        email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;

      if (!ok) {
        const next = failedAttempts + 1;
        setFailedAttempts(next);
        return next >= MAX_ATTEMPTS ? "locked" : "invalid";
      }

      setFailedAttempts(0);
      setUser({ email });
      return "success";
    },
    [failedAttempts]
  );

  const logout = useCallback(() => {
    // TODO: replace with API call (POST /auth/logout)
    setUser(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    // TODO: replace with API call (POST /auth/forgot-password)
    await delay();
    setPendingEmail(email);
  }, []);

  const resetPassword = useCallback(async (_password: string) => {
    // TODO: replace with API call (POST /auth/reset-password)
    await delay();
    setFailedAttempts(0);
  }, []);

  const resendVerification = useCallback(async () => {
    // TODO: replace with API call (POST /auth/resend-verification)
    await delay(600);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      pendingEmail,
      setPendingEmail,
      signup,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
      resendVerification,
    }),
    [user, pendingEmail, signup, login, logout, requestPasswordReset, resetPassword, resendVerification]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
