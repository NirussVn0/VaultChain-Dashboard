'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  AUTH_EVENT_NAME,
  clearSession,
  fetchProfile,
  loadSession,
  type AuthResponse,
  type AuthUser,
} from "@/lib/auth-client";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  refresh: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");

  const setFromSession = useCallback((): AuthResponse | null => {
    const session = loadSession();
    setToken(session?.accessToken ?? null);
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
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      void refresh();
    };
    window.addEventListener(AUTH_EVENT_NAME, handler);
    return () => window.removeEventListener(AUTH_EVENT_NAME, handler);
  }, [refresh]);

  const handleLogout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      status,
      refresh,
      logout: handleLogout,
    }),
    [handleLogout, refresh, status, token, user],
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
