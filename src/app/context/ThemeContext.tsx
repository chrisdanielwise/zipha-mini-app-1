"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark"); // Default to dark theme

  useEffect(() => {
    // Check system's preferred color scheme and set theme accordingly
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    // Set the theme based on the system preference
    setTheme(systemTheme);

    // Add event listener for system theme change (Telegram Mini Apps should support this)
    const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      setTheme(themeMediaQuery.matches ? "dark" : "light");
    };

    themeMediaQuery.addEventListener("change", onChange);

    return () => {
      themeMediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  // Apply the theme to the document body (works within Mini App constraints)
  useEffect(() => {
    // Since Telegram Mini Apps are essentially WebViews, avoid heavy DOM manipulation
    // Toggling 'dark' class on the body will allow for theme styling
    const body = document.body;
    if (body) {
      body.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
