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
    setTimeout(() => setIsToggling(false), 300);
  };

  if (!mounted) {
    return (
      <div className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 opacity-50">
        <div className="h-4 w-4 bg-gray-400 rounded-full animate-pulse ml-1"></div>
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`
        relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ease-in-out
        ${isLight 
          ? 'bg-blue-200 hover:bg-blue-300' 
          : 'bg-gray-700 hover:bg-gray-600'
        }
        ${isToggling ? 'opacity-70' : 'opacity-100'}
        disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={`Alternar para tema ${isLight ? "escuro" : "claro"}`}
      title={`Alternar para tema ${isLight ? "escuro" : "claro"}`}
    >
      {/* Toggle Circle with Icon */}
      <span
        className={`
          inline-flex h-5 w-5 rounded-full bg-white shadow-lg transform transition-all duration-300 ease-in-out items-center justify-center
          ${isLight ? 'translate-x-1' : 'translate-x-6'}
          ${isToggling ? 'scale-95' : 'scale-100'}
        `}
      >
        {isLight ? (
          // Sun Icon
          <svg
            className="w-3 h-3 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        ) : (
          // Moon Icon
          <svg
            className="w-3 h-3 text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      
      {/* Background Icons for context */}
      <span className="absolute left-1.5 top-1 opacity-50">
        <svg
          className="w-2.5 h-2.5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      </span>
      <span className="absolute right-1.5 top-1 opacity-50">
        <svg
          className="w-2.5 h-2.5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      </span>
    </button>
  );
}