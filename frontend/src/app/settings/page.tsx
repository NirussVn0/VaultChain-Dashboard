import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Settings · VaultChain",
};

export default function SettingsPage() {
  const { user, status, logout } = useAuth();
  const isLoading = status !== "authenticated";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-text-tertiary">Control tower</p>
        <h1 className="text-3xl font-semibold text-text-primary">Account settings</h1>
        <p className="text-sm text-text-secondary">
          Manage identity, security, and workspace preferences tied to your VaultChain profile.
        </p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update display name and contact email for trading desks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary">
                    Display name
                  </label>
                  <Input readOnly value={user?.displayName ?? user?.email ?? ""} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-text-tertiary">
                    Email
                  </label>
                  <Input readOnly value={user?.email ?? ""} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-danger/5">
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <CardDescription>Terminate the current session across all devices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-text-secondary">
              Use this when you leave a shared desk or suspect credential compromise.
            </p>
            <Button variant="danger" onClick={() => logout()}>
              Sign out everywhere
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
