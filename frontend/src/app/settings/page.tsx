import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings · VaultChain",
};

export default function SettingsPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background text-text-primary">
      <div className="max-w-lg space-y-3 rounded-2xl border border-border/40 bg-background-surface/80 p-6 text-center shadow-card">
        <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary">In development</p>
        <h1 className="text-2xl font-semibold">Control Tower settings</h1>
        <p className="text-sm text-text-secondary">
          Desk-wide preferences, alert routing, and API key management will land here soon. For now, coordinate with Platform Engineering for any configuration changes.
        </p>
      </div>
    </div>
  );
}
