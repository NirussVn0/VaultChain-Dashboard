import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-xs font-medium text-text-secondary transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      tone: {
        default: "",
        muted: "text-text-tertiary",
        danger: "text-danger",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, tone, ...props }, ref) => (
    <label ref={ref} className={cn(labelVariants({ tone }), className)} {...props} />
  ),
);
Label.displayName = "Label";

export { Label };
