"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale: string) => {
    localStorage.setItem("locale", nextLocale);
    router.push(pathname, { locale: nextLocale });
  };

  const languageNames: Record<string, string> = {
    en: "English",
    vi: "Tiếng Việt",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    zh: "中文",
    hi: "हिन्दी",
    ar: "العربية",
    pt: "Português",
    ru: "Русский",
    ja: "日本語",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Languages className="h-[1.2rem] w-[1.2rem] mr-2" />
          <span>{languageNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ScrollArea className="h-64">
          {Object.entries(languageNames).map(([key, val]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => switchLocale(key)}
              disabled={locale === key}
            >
              {val}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
