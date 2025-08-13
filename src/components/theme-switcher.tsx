
"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Paintbrush } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function ThemeSwitcher() {
  const t = useTranslations('ThemeSwitcher');
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();

  const themes = [
    { name: t('blue'), value: "theme-blue" },
    { name: t('green'), value: "theme-green" },
    { name: t('orange'), value: "theme-orange" },
    { name: t('rose'), value: "theme-rose" },
    { name: t('citron'), value: "theme-citron" },
    { name: t('silver'), value: "theme-silver" },
  ];

  return (
    <>
      <div className="flex items-center gap-2 py-1">
        <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" /> {t('light')}
        </Button>
        <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" /> {t('dark')}
        </Button>
        <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" /> {t('system')}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 py-1">
          {themes.map((t) => (
             <Button 
                key={t.value} 
                variant={colorTheme === t.value ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setColorTheme(t.value as any)}
                className="justify-start"
              >
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: `hsl(var(--${t.value.replace('theme-','')}-primary))`}}></div>
              {t.name}
            </Button>
          ))}
        </div>
    </>
  )
}

    