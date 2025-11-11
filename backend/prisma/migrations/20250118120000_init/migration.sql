-- Create extension for UUID support if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Prisma migration for VaultChain users table
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ANALYST', 'TRADER');

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "displayName" TEXT,
  "roles" "UserRole"[] NOT NULL DEFAULT ARRAY['TRADER']::"UserRole"[],
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "lastLoginAt" TIMESTAMPTZ,
  "passwordVersion" INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX "users_email_idx" ON "users" ("email");

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();
