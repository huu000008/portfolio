"use client";

import { useTheme } from "@/contexts/ThemeProvider";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const getIcon = () => {
    if (theme === "light") return "☀️";
    if (theme === "dark") return "🌙";
    return "🖥️";
  };

  const getLabel = () => {
    if (theme === "light") return "현재 테마: 라이트";
    if (theme === "dark") return "현재 테마: 다크";
    return "현재 테마: 시스템";
  };

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      aria-label="테마 전환"
      title={getLabel()}
      style={{
        fontSize: "2rem",
        padding: "0.6rem 1.2rem",
        borderRadius: "9999px",
        background: "transparent",
        border: "1px solid var(--text)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {getIcon()}
    </button>
  );
};
