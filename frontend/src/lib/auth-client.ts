export interface AuthUser {
  id: string;
  email: string;
  displayName?: string | null;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type SessionStorageStrategy = "local" | "session";

export class AuthError extends Error {
  status: number;
  details: Record<string, string> | undefined;

  constructor(message: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL =
  process.env["NEXT_PUBLIC_API_BASE_URL"]?.replace(/\/$/, "") ?? "http://localhost:4000/api/v1";

import { AUTH_COOKIE_NAME, AUTH_EVENT_NAME, AUTH_STORAGE_KEY } from "./auth-constants";

const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const getStorageDriver = (strategy: SessionStorageStrategy): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return strategy === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
};

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message ?? "Unable to process request.";
    const details =
      typeof data?.message === "object"
        ? data.message
        : Array.isArray(data?.message)
          ? { form: data.message.join(". ") }
          : undefined;
    throw new AuthError(message, response.status, details);
  }

  return data as T;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function persistSession(
  response: AuthResponse,
  options: { storage?: SessionStorageStrategy } = {},
): void {
  const storage = getStorageDriver(options.storage ?? "local");
  if (!storage) {
    return;
  }

  try {
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
    const otherStorage = getStorageDriver(options.storage === "session" ? "local" : "session");
    otherStorage?.removeItem(AUTH_STORAGE_KEY);
    setAuthCookie(response.accessToken, response.expiresIn);
    emitAuthEvent();
  } catch (error) {
    console.warn("Failed to persist auth session", error);
  }
}

export function loadSession(): AuthResponse | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const localValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const sessionValue = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    return safeJsonParse<AuthResponse>(localValue ?? sessionValue);
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    clearAuthCookie();
    emitAuthEvent();
  } catch (error) {
    console.warn("Failed to clear auth session", error);
  }
}

export function logout(): void {
  clearSession();
}

export function getStoredToken(): string | null {
  return loadSession()?.accessToken ?? null;
}

export async function fetchProfile(accessToken?: string): Promise<AuthUser> {
  const token = accessToken ?? getStoredToken();
  if (!token) {
    throw new AuthError("Missing session", 401);
  }
  return request<AuthUser>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function emitAuthEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}

function setAuthCookie(token: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = Number.isFinite(maxAgeSeconds) && maxAgeSeconds > 0 ? maxAgeSeconds : 3600;
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${maxAge}; SameSite=Strict; secure`;
}

function clearAuthCookie(): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict; secure`;
}
