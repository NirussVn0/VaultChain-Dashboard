import { Request } from "express";
import { UserRole } from "@prisma/client";

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  pv: number;
  iat?: number;
  exp?: number;
}

export interface AuthPrincipal {
  id: string;
  email: string;
  displayName?: string | null;
  roles: UserRole[];
  createdAt: Date;
  lastLoginAt?: Date | null;
  passwordVersion: number;
}

export type AuthenticatedRequest = Request & { user: AuthPrincipal };
