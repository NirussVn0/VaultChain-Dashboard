'use client';

import { useCallback, useEffect, useState } from "react";

type ThemeMode = "dark" | "light";
type ThemeUpdater = ThemeMode | ((current: ThemeMode) => ThemeMode);

const STORAGE_KEY = "vaultchain-theme";

interface UseThemeReturn {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isMounted: boolean;
}

const prefersDarkScheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

const resolveInitialTheme = (initialMode: ThemeMode): ThemeMode => {
  if (typeof window === "undefined") {
    return initialMode;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return prefersDarkScheme() ? "dark" : initialMode;
};

/**
 * Manages the global color theme for the dashboard by syncing the
 * `data-theme` attribute on the document body and persisting state in localStorage.
 */
export function useTheme(initialMode: ThemeMode = "dark"): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>(() => resolveInitialTheme(initialMode));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset["theme"] = theme;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (!isMounted && typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMounted(true);
    }
  }, [isMounted]);

  const setTheme = useCallback((updater: ThemeUpdater) => {
    setThemeState((current) =>
      typeof updater === "function" ? (updater as (value: ThemeMode) => ThemeMode)(current) : updater,
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isMounted,
  };
}
