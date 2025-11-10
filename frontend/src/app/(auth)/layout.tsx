import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Secure Access · VaultChain",
    template: "%s · VaultChain",
  },
  description: "Institutional-grade authentication for the VaultChain trading & analytics suite.",
};

export default function AuthRouteGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#050917] via-[#0B1124] to-[#111C3A] text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/30 to-transparent blur-3xl" />
      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-white/5 p-8 text-white shadow-2xl backdrop-blur-2xl">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
              VaultChain Identity
            </p>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight">
                Encrypted access to TradingView-grade execution tooling.
              </h1>
              <p className="text-base text-white/70">
                Multifactor policies, anomaly monitoring, and role-aware JWT sessions keep every desk compliant from onboarding to final sign-off.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
            <div className="flex items-center justify-between">
              <span>24/7 anomaly scans</span>
              <span className="text-lg font-semibold text-white">38B signals/day</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Median login latency</span>
              <span className="text-lg font-semibold text-white">142ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Compromise detection SLA</span>
              <span className="text-lg font-semibold text-white">&lt; 30s</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
