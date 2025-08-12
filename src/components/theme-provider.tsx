"use client"

import { useTheme as useNextTheme } from "next-themes"
import * as React from "react"

const THEME_KEY = "color-theme"

type Theme = "theme-blue" | "theme-green" | "theme-orange" | "theme-rose" | "theme-citron" | "theme-silver"

type ThemeProviderState = {
  theme: string
  setTheme: (theme: string) => void
  colorTheme: Theme
  setColorTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  const { theme, setTheme } = useNextTheme()
  const [colorTheme, setColorTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "theme-silver"
    return (localStorage.getItem(THEME_KEY) as Theme) || "theme-silver"
  })

  React.useEffect(() => {
    localStorage.setItem(THEME_KEY, colorTheme)
    document.body.className = ""
    document.body.classList.add(colorTheme)
    if(theme) document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))

  }, [colorTheme, theme])

  const value = {
    theme: theme || "system",
    setTheme,
    colorTheme,
    setColorTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
