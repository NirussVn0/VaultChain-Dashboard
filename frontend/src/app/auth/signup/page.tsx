import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account · VaultChain",
  description: "Provision a new VaultChain identity with institutional-grade password policies.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
