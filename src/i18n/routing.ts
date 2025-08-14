import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "vi", "es", "fr", "de", "zh", "hi", "ar", "pt", "ru", "ja"],

  // Used when no locale matches
  defaultLocale: "en",
});
