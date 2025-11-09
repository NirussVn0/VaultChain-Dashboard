'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { login, persistSession, register, type RegisterPayload } from "@/lib/auth-client";
import { PASSWORD_REQUIREMENTS } from "@/lib/password-policy";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PasswordChecklist } from "./password-checklist";

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128, "Password is too long.")
  .regex(/[A-Z]/, "Add an uppercase letter.")
  .regex(/[a-z]/, "Add a lowercase letter.")
  .regex(/\d/, "Add a number.")
  .regex(/[^A-Za-z0-9]/, "Add a special character.");

const loginSchema = z.object({
  email: z.string().email("Provide a valid institutional email."),
  password: passwordSchema,
});

const signupSchema = loginSchema
  .extend({
    displayName: z
      .string()
      .min(2, "Add your full name.")
      .max(60, "Name is too long."),
    confirmPassword: z.string(),
    roles: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

interface ServerState {
  status: "idle" | "error" | "success";
  message?: string;
}

/**
 * VaultChain authentication form with realtime validation && API integration.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [serverState, setServerState] = useState<ServerState>({ status: "idle" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = mode === "signup" ? signupSchema : loginSchema;
  const form = useForm<LoginValues | SignupValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "signup"
        ? {
            email: "",
            password: "",
            displayName: "",
            confirmPassword: "",
            roles: ["TRADER"],
          }
        : {
            email: "",
            password: "",
          },
  });

  const passwordValue = form.watch("password") as string;

  const headline = mode === "signup" ? "Create secure access" : "Welcome back to VaultChain";
  const subline =
    mode === "signup"
      ? "Institutional-grade authentication protects your strategies and research workspace."
      : "Sign in to access live execution tools, AI research, and encrypted market workspaces.";

  const ctaLabel = mode === "signup" ? "Create account" : "Sign in";

  const checklistEnabled = mode === "signup" || Boolean(passwordValue);

  async function handleSubmit(values: LoginValues | SignupValues): Promise<void> {
    setServerState({ status: "idle" });
    setIsSubmitting(true);

    try {
      let response;
      if (mode === "signup") {
        const signupValues = values as SignupValues;
        const payload: RegisterPayload = {
          email: signupValues.email,
          password: signupValues.password,
          displayName: signupValues.displayName,
        };
        if (signupValues.roles && signupValues.roles.length > 0) {
          payload.roles = signupValues.roles;
        }
        response = await register(payload);
      } else {
        response = await login({
          email: values.email,
          password: values.password,
        });
      }
      persistSession(response);
      setServerState({
        status: "success",
        message: "Authenticated successfully. Redirecting to the trading floor…",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed. Please try again.";
      setServerState({
        status: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const requirementSummary = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((rule) => rule.label).join(" • ");
  }, []);

  const alternateHref = (mode === "signup" ? "/auth/login" : "/auth/signup") as Route;

  return (
    <div className="space-y-6 rounded-2xl border border-border/40 bg-background/70 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" />
          Zero-trust authentication
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{headline}</h1>
          <p className="text-sm text-text-secondary">{subline}</p>
        </div>
      </div>

      {serverState.status !== "idle" && (
        <Alert variant={serverState.status === "error" ? "danger" : "success"}>
          <AlertTitle>{serverState.status === "error" ? "We hit an issue" : "All good"}</AlertTitle>
          <AlertDescription>{serverState.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          {mode === "signup" && (
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="headtrader@vaultchain.fund" {...field} />
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
                    placeholder="••••••••••••"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === "signup" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Repeat password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {checklistEnabled && <PasswordChecklist value={passwordValue} />}

          <div className="space-y-2 text-xs text-text-tertiary">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-text-tertiary" />
              All credentials are encrypted at rest & monitored for breach attempts.
            </div>
            <p>{requirementSummary}</p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Securing session…
              </>
            ) : (
              ctaLabel
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-text-secondary">
        {mode === "signup" ? "Already onboarded?" : "Need access for a teammate?"}{" "}
        <Link className="font-semibold text-primary hover:text-primary/80" href={alternateHref}>
          {mode === "signup" ? "Sign in here" : "Request an account"}
        </Link>
      </p>
    </div>
  );
}
