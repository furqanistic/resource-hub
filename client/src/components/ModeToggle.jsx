// File: client/src/components/ModeToggle.jsx
import * as React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sparkle = ({ x, y, color }) => (
  <motion.div
    initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
    animate={{
      scale: [0, 1.2, 0],
      opacity: [1, 1, 0],
      x: x,
      y: y
    }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="absolute h-1.5 w-1.5 rounded-full pointer-events-none"
    style={{
      backgroundColor: color,
      boxShadow: `0 0 4px ${color}`
    }}
  />
);

export function ModeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [sparkles, setSparkles] = React.useState([]);

  const isDarkMode = theme === "dark" || (theme === "system" && typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const createSparkles = () => {
    const newSparkles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      color: isDarkMode ? "#fcd34d" : "#3b82f6"
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 500);
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
    createSparkles();
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group relative flex h-10 w-20 cursor-pointer items-center rounded-full border-2 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden",
        isDarkMode
          ? "bg-linear-to-br from-slate-900 via-slate-950 to-black border-slate-700/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.4)]"
          : "bg-linear-to-b from-sky-100 to-white border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
        className
      )}
      aria-label="Toggle theme"
    >
      {/* Decorative SVG Curved Path */}
      <svg
        viewBox="0 0 80 40"
        className="absolute inset-0 h-full w-full pointer-events-none overflow-visible"
      >
        <motion.path
          d="M 15 20 Q 40 38 65 20"
          fill="transparent"
          stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{
            strokeDasharray: isDarkMode ? "4 4" : "1 0",
          }}
        />
      </svg>

      {/* Hidden indicator icons */}
      <div className="absolute inset-x-3 flex justify-between px-1 opacity-10">
        <Sun className="h-4 w-4" />
        <Moon className="h-4 w-4" />
      </div>

      {/* The Animated Handle (Sun/Moon) */}
      <motion.div
        initial={false}
        animate={{
          x: isDarkMode ? 42 : 0,
          y: [0, 8, 0], // Creates the curved movement effect
          scale: [1, 0.9, 1],
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          y: { duration: 0.4, times: [0, 0.5, 1] },
          scale: { duration: 0.4 }
        }}
        className={cn(
          "relative z-10 ml-1.5 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95",
          isDarkMode
            ? "bg-slate-800 shadow-[0_0_15px_rgba(253,224,71,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]"
            : "bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDarkMode ? "dark" : "light"}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isDarkMode ? (
              <Moon className="h-5 w-5 text-yellow-300 fill-yellow-300/20" />
            ) : (
              <Sun className="h-5 w-5 text-orange-500 fill-orange-500/20" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sparkling Particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} {...sparkle} />
          ))}
        </div>
      </motion.div>

      {/* Interactive Ray effect on click */}
      {sparkles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.1, 0], scale: [0.5, 2, 2.5] }}
          className={cn(
            "absolute inset-0 rounded-full pointer-events-none",
            isDarkMode ? "bg-yellow-400" : "bg-blue-400"
          )}
        />
      )}
    </button>
  );
}
