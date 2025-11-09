import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in · VaultChain",
  description: "Authenticate to access VaultChain trading and analytics surfaces.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
