'use client';

import { useMemo } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const iconVariants = {
  initial: { rotate: -20, opacity: 0, scale: 0.9 },
  animate: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 20, opacity: 0, scale: 0.9 },
};

/**
 * Toggle switch for dark/light themes with micro interaction feedback.
 */
export function ThemeToggle() {
  const { theme, toggleTheme, isMounted } = useTheme();

  const label = useMemo(
    () => (theme === "dark" ? "Enable light theme" : "Enable dark theme"),
    [theme],
  );

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-xl border border-border/60 bg-background-elevated/40 text-text-primary hover:border-border hover:bg-background-elevated/60"
    >
      <AnimatePresence initial={false} mode="wait">
        {isMounted ? (
          theme === "dark" ? (
            <motion.span
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="inline-flex"
            >
              <MoonStar className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="inline-flex"
            >
              <SunMedium className="h-4 w-4" aria-hidden="true" />
            </motion.span>
          )
        ) : null}
      </AnimatePresence>
      <span className="sr-only">{label}</span>
    </Button>
  );
}
