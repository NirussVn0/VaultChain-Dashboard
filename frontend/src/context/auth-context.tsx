'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { toast } from "@/components/ui/toaster";
import { clearSession, fetchProfile, loadSession, type AuthResponse, type AuthUser } from "@/lib/auth-client";
import { AUTH_EVENT_NAME } from "@/lib/auth-constants";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  login: (session?: AuthResponse) => void;
  logout: (reason?: "manual" | "expired") => void;
  sessionExpired: boolean;
  acknowledgeSessionExpiry: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [sessionExpired, setSessionExpired] = useState(false);

  const setFromSession = useCallback((): AuthResponse | null => {
    const session = loadSession();
    setToken(session?.accessToken ?? null);
    if (session) {
      setSessionExpired(false);
    }
    return session;
  }, []);

  const refresh = useCallback(async () => {
    const session = setFromSession();
    if (!session) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setStatus((prev) => (prev === "authenticated" ? prev : "loading"));
    try {
      const profile = await fetchProfile(session.accessToken);
      setUser(profile);
      setStatus("authenticated");
    } catch (error) {
      console.warn("Failed to fetch profile", error);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [setFromSession]);

  useEffect(() => {
    const id = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(id);
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      void refresh();
    };
    window.addEventListener(AUTH_EVENT_NAME, handler);
    return () => window.removeEventListener(AUTH_EVENT_NAME, handler);
  }, [refresh]);

  const handleLogout = useCallback((reason: "manual" | "expired" = "manual") => {
    clearSession();
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
    setSessionExpired(reason === "expired");
  }, []);

  const handleLogin = useCallback(
    (session?: AuthResponse) => {
      if (session) {
        setUser(session.user);
        setToken(session.accessToken);
        setStatus("authenticated");
        setSessionExpired(false);
        return;
      }
      void refresh();
    },
    [refresh],
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    const session = loadSession();
    if (!session?.expiresAt) {
      return;
    }
    const msRemaining = session.expiresAt - Date.now();
    const timer = window.setTimeout(() => {
      handleLogout("expired");
    }, Math.max(msRemaining, 0));
    return () => window.clearTimeout(timer);
  }, [handleLogout, token]);

  useEffect(() => {
    if (!sessionExpired) {
      return;
    }
    toast.error("Session expired", {
      description: "Please sign in again to continue.",
    });
  }, [sessionExpired]);

  const acknowledgeSessionExpiry = useCallback(() => setSessionExpired(false), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      status,
      refresh,
      login: handleLogin,
      isAuthenticated: status === "authenticated",
      logout: handleLogout,
      sessionExpired,
      acknowledgeSessionExpiry,
    }),
    [acknowledgeSessionExpiry, handleLogout, handleLogin, refresh, sessionExpired, status, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
