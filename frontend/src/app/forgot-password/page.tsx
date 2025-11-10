import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password · VaultChain",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background text-text-primary">
      <div className="max-w-md space-y-3 rounded-2xl border border-border/50 bg-background-surface/80 p-6 text-center shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">Coming Soon</p>
        <h1 className="text-2xl font-semibold">Password reset</h1>
        <p className="text-sm text-text-secondary">
          The automated reset flow is in progress. Contact VaultChain Ops to regain access or use your backup MFA token.
        </p>
      </div>
    </div>
  );
}
