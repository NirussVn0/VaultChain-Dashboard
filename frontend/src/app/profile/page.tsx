import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile · VaultChain",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background text-text-primary">
      <div className="max-w-lg space-y-3 rounded-2xl border border-border/40 bg-background-surface/80 p-6 text-center shadow-card">
        <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">Coming soon</p>
        <h1 className="text-2xl font-semibold">Profile workspace</h1>
        <p className="text-sm text-text-secondary">
          Personalized settings, MFA management, and desk preferences will live here. For now, reach out to the Ops desk to update your profile.
        </p>
      </div>
    </div>
  );
}
