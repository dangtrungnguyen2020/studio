// src/components/keystroke-symphony/app-header.tsx
"use client";

import Link from "next/link";
import {
  Settings,
  Info,
  Gamepad2,
  BookOpen,
  Newspaper,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Shield,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";
import LanguageSwitcher from "@/components/language-switcher";
import LoginDialog from "@/components/keystroke-symphony/login-dialog";
import UserMenu from "@/components/keystroke-symphony/user-menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getAdminUids } from "@/app/actions-for-client";
import { verifyAdmin } from "@/app/actions/user";
import { onAuthStateChanged } from "firebase/auth";

type AppHeaderProps = {
  page:
    | "home"
    | "game"
    | "info"
    | "articles"
    | "new-article"
    | "view-article"
    | "admin"
    | "admin-dashboard"
    | "admin-users"
    | "products"
    | "view-product";
};

export default function AppHeader({ page }: AppHeaderProps) {
  const [user] = useAuthState(auth);
  const tHome = useTranslations("HomePage");
  const tGame = useTranslations("GamePage");
  const tSettings = useTranslations("ThemeSwitcher");
  const tArticles = useTranslations("ArticlePage");
  const tAdmin = useTranslations("AdminPage");
  const tProducts = useTranslations("ProductPage");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // const auth = getAuth();
    // Set up a listener for the user's authentication state.
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Force a refresh of the ID token to get the latest custom claims.
        const idTokenResult = await currentUser.getIdTokenResult(true);
        const claims = idTokenResult.claims;

        // Check for the 'admin' claim.
        if (claims.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        // User is not signed in.
        setIsAdmin(false);
      }
    });

    // Clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  const getTitle = () => {
    switch (page) {
      case "game":
        return tGame("title");
      case "articles":
      case "new-article":
      case "view-article":
        return tArticles.raw("title");
      case "admin":
      case "admin-dashboard":
      case "admin-users":
        return tAdmin.raw("title");
      case "products":
      case "view-product":
        return tProducts.raw("title");
      default:
        return tHome("title");
    }
  };

  const getSubtitle = () => {
    switch (page) {
      case "game":
        return tGame("subtitle");
      case "articles":
        return tArticles("subtitle");
      case "new-article":
        return tArticles("newArticleSubtitle");
      case "view-article":
        return "";
      case "admin":
        return tAdmin("subtitle");
      case "admin-dashboard":
        return tAdmin("dashboardSubtitle");
      case "admin-users":
        return tAdmin("usersSubtitle");
      case "products":
        return tProducts("subtitle");
      default:
        return undefined;
    }
  };

  const title = getTitle();
  const subtitle = getSubtitle();

  return (
    <header className="w-full flex justify-between items-center p-6 max-sm:py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{title}</h1>
        {subtitle && (
          <span className="text-xl sm:text-2xl font-semibold text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {page === "home" && (
          <Link href="/game">
            <Button variant="outline">
              <Gamepad2 className="mr-2 h-4 w-4" />
              {tHome("gameMode")}
            </Button>
          </Link>
        )}
        {page === "game" && (
          <Link href="/">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              {tGame("practiceMode")}
            </Button>
          </Link>
        )}
        {user ? <UserMenu /> : <LoginDialog />}

        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" /> {tAdmin("title")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/admin/dashboard">
                <DropdownMenuItem>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {tAdmin("dashboardTitle")}
                </DropdownMenuItem>
              </Link>
              <Link href="/admin">
                <DropdownMenuItem>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {tAdmin("reviewTitle")}
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/users">
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  {tAdmin("usersTitle")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{tSettings("appearance")}</DropdownMenuLabel>
            <div className="px-2">
              <ThemeSwitcher />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <LanguageSwitcher />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/products">
              <DropdownMenuItem>
                <Keyboard className="h-4 w-4 mr-2" />
                {tProducts("title")}
              </DropdownMenuItem>
            </Link>
            <Link href="/articles">
              <DropdownMenuItem>
                <Newspaper className="h-4 w-4 mr-2" />
                {tArticles("title")}
              </DropdownMenuItem>
            </Link>
            {page !== "info" && (
              <>
                <DropdownMenuSeparator />
                <Link href="/info">
                  <DropdownMenuItem>
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
