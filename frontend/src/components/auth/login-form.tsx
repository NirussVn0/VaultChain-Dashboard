'use client';

import Link from "next/link";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login, persistSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/context/auth-context";

const loginSchema = z.object({
  email: z.string().email("Enter a valid institutional email."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: syncAuth } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const redirectTarget = (searchParams.get("redirectTo") as Route | null) ?? ("/" as Route);
  const attemptLogin = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await login({ email: values.email, password: values.password });
      const enriched = persistSession(response, {
        storage: values.rememberMe ? "local" : "session",
      });
      syncAuth(enriched);
      toast.success("Authenticated", {
        description: "Redirecting you to the trading floor…",
      });
      router.push(redirectTarget);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      toast.error("Authentication failed", {
        description: message,
        action: {
          label: "Retry",
          onClick: () => {
            void attemptLogin(values);
          },
        },
      });
    }
  };

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    await attemptLogin(values);
  };

  return (
    <div className="relative">
      <Card className="w-full max-w-[460px] bg-background/70 backdrop-blur-xl">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <ShieldCheck className="h-4 w-4" />
            Zero-trust access
          </div>
          <CardTitle>Sign in to VaultChain</CardTitle>
          <CardDescription>
            Command latency, AI research, and execution tooling. Protected with institutional policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="desk.lead@vaultchain.io" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          aria-label="Remember this device"
                          checked={field.value}
                          onCheckedChange={(checked: CheckedState) => field.onChange(checked === true)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Remember me</FormLabel>
                    </FormItem>
                  )}
                />
                <Link
                  href={"/forgot-password" as Route}
                  className="text-sm font-medium text-primary transition hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full text-sm font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Securing session…
                  </>
                ) : (
                  "Enter Vault"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/30 px-4 py-3 text-xs text-text-tertiary">
            <Lock className="h-4 w-4" />
            Your credentials are encrypted, monitored, and protected by anomaly detection.
          </div>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Need an account?{" "}
            <Link className="font-semibold text-primary hover:text-primary/80" href={"/signup" as Route}>
              Request access
            </Link>
          </p>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isSubmitting ? (
          <motion.div
            variants={overlayMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 rounded-xl bg-background/80 backdrop-blur-sm"
          >
            <div className="flex h-full flex-col justify-center gap-3 p-6">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-2/3 rounded-lg" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
