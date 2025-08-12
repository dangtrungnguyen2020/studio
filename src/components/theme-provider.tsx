"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

const THEME_STORAGE_KEY = "keystroke-symphony-page-theme";

type CustomThemeProviderProps = {
  children: React.ReactNode;
}

type ThemeContextType = {
  colorTheme: string;
  setColorTheme: (theme: string) => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: CustomThemeProviderProps) {
  const [colorTheme, setColorThemeState] = React.useState('silver');

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      setColorThemeState(savedTheme);
    }
  }, []);

  const setColorTheme = (newTheme: string) => {
    setColorThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };
  
  const providerValue = {
    colorTheme,
    setColorTheme,
  };

  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <ThemeContext.Provider value={providerValue}>
        <div className={`theme-${colorTheme}`}>
          {children}
        </div>
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  const nextThemeContext = useNextTheme();

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return { ...context, ...nextThemeContext };
}
