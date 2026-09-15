"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const applyTheme = useCallback((selectedTheme) => {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
    } else if (selectedTheme === "light") {
      root.classList.remove("dark");
    } else if (selectedTheme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("recipe_app_theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, [applyTheme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("recipe_app_theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
