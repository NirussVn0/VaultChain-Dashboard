'use client';

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

import { PASSWORD_REQUIREMENTS, getPasswordScore } from "@/lib/password-policy";
import { cn } from "@/lib/utils";

interface PasswordChecklistProps {
  value: string;
}

/**
 * Renders interactive password strength feedback.
 */
export function PasswordChecklist({ value }: PasswordChecklistProps) {
  const score = getPasswordScore(value);

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-background-elevated/30 p-3">
      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>Password strength</span>
        <span className="font-semibold text-text-secondary">
          {score === 1 ? "Excellent" : score >= 0.6 ? "Strong" : score > 0 ? "Weak" : "Start typing"}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-surface/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-danger via-warning to-success"
          animate={{ width: `${Math.max(score * 100, score > 0 ? 12 : 0)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        />
      </div>
      <ul className="grid gap-2 text-xs text-text-tertiary md:grid-cols-2">
        {PASSWORD_REQUIREMENTS.map((requirement) => {
          const passed = requirement.test(value);
          return (
            <li key={requirement.id} className={cn("flex items-center gap-2", passed ? "text-success" : "")}>
              {passed ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span>{requirement.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
