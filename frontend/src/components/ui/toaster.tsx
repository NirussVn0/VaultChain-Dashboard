'use client';

import { Toaster as SonnerToaster, toast } from "sonner";

export const Toaster = () => (
  <SonnerToaster
    position="top-right"
    expand={false}
    richColors
    toastOptions={{
      className:
        "rounded-xl border border-border/60 bg-background-surface/95 text-text-primary shadow-2xl backdrop-blur",
      descriptionClassName: "text-sm text-text-secondary",
      actionButtonStyle: {
        background: "rgba(59,130,246,0.15)",
        color: "#F1F5F9",
      },
      duration: 4200,
    }}
  />
);

export { toast };
