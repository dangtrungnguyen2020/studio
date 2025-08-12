"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Paintbrush } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

const themes = [
  { name: "Blue", value: "theme-blue" },
  { name: "Green", value: "theme-green" },
  { name: "Orange", value: "theme-orange" },
  { name: "Rose", value: "theme-rose" },
  { name: "Citron", value: "theme-citron" },
  { name: "Silver", value: "theme-silver" },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [colorTheme, setColorTheme] = React.useState('theme-silver');
  
  React.useEffect(() => {
    const savedColorTheme = localStorage.getItem('color-theme');
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  React.useEffect(() => {
    document.body.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add(colorTheme);
    localStorage.setItem('color-theme', colorTheme);
  }, [colorTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-2 px-2 py-1">
          <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" /> Light
          </Button>
          <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" /> Dark
          </Button>
          <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('system')}>
            <Monitor className="mr-2 h-4 w-4" /> System
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <div className="grid grid-cols-3 gap-2 px-2 py-1">
          {themes.map((t) => (
             <Button 
                key={t.value} 
                variant={colorTheme === t.value ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setColorTheme(t.value)}
              >
              <Paintbrush className="mr-2 h-4 w-4" /> {t.name}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
