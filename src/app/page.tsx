"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default async function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const storedLocale = localStorage.getItem("locale") || "en";
    router.replace(`/${storedLocale}`);
  }, []);
  return null;
}
