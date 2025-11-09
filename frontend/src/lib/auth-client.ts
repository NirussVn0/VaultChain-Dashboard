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

export function persistSession(response: AuthResponse): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem("vaultchain.auth", JSON.stringify(response));
  } catch (error) {
    console.warn("Failed to persist auth session", error);
  }
}
