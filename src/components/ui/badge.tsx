import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/15 text-text-primary backdrop-blur supports-[backdrop-filter]:bg-primary/10",
        success:
          "border-success/30 bg-success/15 text-success supports-[backdrop-filter]:bg-success/10",
        danger:
          "border-danger/30 bg-danger/15 text-danger supports-[backdrop-filter]:bg-danger/10",
        outline: "border-border text-text-tertiary bg-transparent",
      },
      soft: {
        true: "shadow-inset",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      soft: false,
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, soft, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, soft }), className)}
      {...props}
    />
  );
}
