// File: client/src/components/ModeToggle.jsx
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

export function ModeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(isDark ? "light" : "dark");
  };

  const isDarkMode = theme === "dark" || (theme === "system" && typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-8 w-14 cursor-pointer items-center rounded-full px-1 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 overflow-hidden",
        isDarkMode ? "bg-slate-800" : "bg-slate-200",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="absolute inset-x-1 flex justify-between px-1 text-muted-foreground/30">
        <Sun className="h-3 w-3" />
        <Moon className="h-3 w-3" />
      </div>

      <div
        className={cn(
          "z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-500 ease-in-out",
          isDarkMode ? "translate-x-6 rotate-360" : "translate-x-0 rotate-0"
        )}
      >
        {isDarkMode ? (
          <Moon className="h-3.5 w-3.5 text-slate-900 transition-transform duration-500" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500 transition-transform duration-500" />
        )}
      </div>
    </button>
  );
}
