"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Initial read
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");

    // Watch for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isLight = document.documentElement.classList.contains("light");
          setTheme(isLight ? "light" : "dark");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return theme;
}
