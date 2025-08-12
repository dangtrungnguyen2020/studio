"use client"

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import * as React from "react"

const COLOR_THEME_KEY = "color-theme"

type ColorTheme = "theme-blue" | "theme-green" | "theme-orange" | "theme-rose" | "theme-citron" | "theme-silver"

type CustomThemeProviderState = {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
  theme?: string
  setTheme: (theme: string) => void
}

const CustomThemeContext = React.createContext<CustomThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
}) {
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>(() => {
    if (typeof window === "undefined") return "theme-blue"
    return (localStorage.getItem(COLOR_THEME_KEY) as ColorTheme) || "theme-blue"
  })
  
  React.useEffect(() => {
    localStorage.setItem(COLOR_THEME_KEY, colorTheme)
    const body = document.body
    body.classList.forEach(c => {
      if (c.startsWith('theme-')) {
        body.classList.remove(c)
      }
    });
    body.classList.add(colorTheme)
  }, [colorTheme])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <InnerThemeProvider setColorThemeOuter={setColorTheme} colorThemeOuter={colorTheme}>
        {children}
      </InnerThemeProvider>
    </NextThemesProvider>
  )
}

function InnerThemeProvider({ children, setColorThemeOuter, colorThemeOuter}: { children: React.ReactNode, setColorThemeOuter: (theme: ColorTheme) => void, colorThemeOuter: ColorTheme }) {
  const { theme, setTheme } = useNextTheme()
  
  const value = {
    theme: theme,
    setTheme,
    colorTheme: colorThemeOuter,
    setColorTheme: setColorThemeOuter,
  }

  return (
    <CustomThemeContext.Provider value={value}>
      {children}
    </CustomThemeContext.Provider>
  )
}


export const useTheme = () => {
  const context = React.useContext(CustomThemeContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
