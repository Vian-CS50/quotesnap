"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="border p-2 transition-colors"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)',
        borderRadius: '0px'
      }}
    >
      {theme === "light" ? (
        <Sun className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
      ) : (
        <Moon className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
      )}
    </button>
  );
}
