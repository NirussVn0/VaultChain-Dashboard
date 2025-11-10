'use client';

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, UserPlus2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { register as registerUser, persistSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import { useAuth } from "@/context/auth-context";

import { PasswordChecklist } from "./password-checklist";

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128, "Password too long.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/\d/, "Include a number.")
  .regex(/[^A-Za-z0-9]/, "Include a special character.");

const signupSchema = z
  .object({
    displayName: z.string().min(2, "Name is required.").max(60, "Name is too long."),
    email: z.string().email("Provide a valid email."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function SignupForm() {
  const router = useRouter();
  const { login: syncAuth } = useAuth();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const passwordValue = useWatch({
    control: form.control,
    name: "password",
  });

  const handleSubmit = async (values: SignupFormValues): Promise<void> => {
    try {
      const response = await registerUser({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
      });
      persistSession(response, { storage: "local" });
      syncAuth(response);
      toast.success("Account created", {
        description: "Provisioning your workspace…",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      toast.error("Registration failed", {
        description: message,
      });
    }
  };

  return (
    <div className="relative">
      <Card className="w-full max-w-[520px] bg-background/70 backdrop-blur-xl">
        <CardHeader className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <UserPlus2 className="h-4 w-4" />
            Secure onboarding
          </div>
          <CardTitle>Request VaultChain access</CardTitle>
          <CardDescription>
            Verify your identity, configure MFA, and unlock TradingView-grade intelligence with institutional safeguards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" placeholder="Avery Nakamoto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="ops.lead@vaultchain.io" {...field} />
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
                      <Input type="password" autoComplete="new-password" placeholder="••••••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" placeholder="Repeat password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PasswordChecklist value={passwordValue ?? ""} />

              <Button type="submit" className="w-full text-sm font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating workspace…
                  </>
                ) : (
                  "Launch Workspace"
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-border/40 bg-background-elevated/30 px-4 py-3 text-xs text-text-tertiary">
            <Sparkles className="h-4 w-4" />
            MFA + anomaly detection are enforced the moment your identity is approved.
          </div>
          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have access?{" "}
            <Link className="font-semibold text-primary hover:text-primary/80" href={"/login" as Route}>
              Sign in
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
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
