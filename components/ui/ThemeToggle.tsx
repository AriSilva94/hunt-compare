"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (!mounted) return;
    setIsToggling(true);
    toggleTheme();
    setTimeout(() => setIsToggling(false), 150);
  };

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 rounded-md opacity-50">
        <div className="w-5 h-5 bg-gray-400 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-all duration-150 disabled:opacity-50"
      aria-label={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
      title={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
    >
      <div className={`transition-transform duration-150 ${isToggling ? 'scale-90' : 'scale-100'}`}>
        {theme === "light" ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </div>
    </button>
  );
}