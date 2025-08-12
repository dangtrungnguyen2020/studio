"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const THEME_STORAGE_KEY = "keystroke-symphony-page-theme";

type CustomThemeProviderProps = {
  children: React.ReactNode;
}

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  mode: string;
  setMode: (mode: string) => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme, setThemeState] = React.useState('silver');
  const [mode, setModeState] = React.useState('system');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      const { theme: savedColor, mode: savedMode } = JSON.parse(savedTheme);
      setThemeState(savedColor || 'silver');
      setModeState(savedMode || 'system');
    }
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme: newTheme, mode }));
  };
  
  const setMode = (newMode: string) => {
    setModeState(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme, mode: newMode }));
  };

  const providerValue = {
    theme,
    setTheme,
    mode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={providerValue}>
      <NextThemesProvider 
        attribute="class"
        defaultTheme={mode}
        enableSystem
      >
        <div className={`theme-${theme}`}>
          {children}
        </div>
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
