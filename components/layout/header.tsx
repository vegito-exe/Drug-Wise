"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Send,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import LocaleSwitcher from "./locale-switcher";
import UserMenu from "./user-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const navLinks = [
    { href: "/", label: t("home"), id: "nav-home" },
    { href: "/years/3", label: t("browse"), id: "nav-browse" },
    { href: "/faq", label: t("faq"), id: "nav-faq" },
    { href: "/my-questions", label: t("myQuestions"), id: "nav-questions" },
    ...(isAdmin
      ? [{ href: "/admin/dashboard", label: t("adminDashboard"), id: "nav-admin" }]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-outline-variant/40 sticky top-0 z-50 elevation-1">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3.5 max-w-[1280px] mx-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group" id="header-brand">
          <img
            src="/logo-removebg-with-txt.svg"
            alt="DrugWise"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              id={link.id}
              className={`font-[var(--font-ibm-plex)] text-label-md px-3.5 py-2 rounded-lg transition-all duration-200 ${
                isActive(link.href)
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-neutral"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Telegram */}
          <Button
            asChild
            size="lg"
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-telegram-blue to-telegram-blue/90 text-white rounded-xl font-[var(--font-ibm-plex)] text-label-md hover:opacity-90 elevation-1 hover:elevation-2 transition-all duration-200 h-auto py-2"
            id="header-telegram"
          >
            <a
              href="https://t.me/DrugWise30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="w-4 h-4" />
              {t("joinTelegram")}
            </a>
          </Button>

          {/* User / Locale */}
          <LocaleSwitcher />

          <UserMenu />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-outline-variant/40 px-margin-mobile py-4 flex flex-col gap-2 animate-fade-in-up" id="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`font-[var(--font-ibm-plex)] text-label-md py-2.5 px-4 rounded-xl transition-all duration-200 ${
                isActive(link.href)
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-on-surface-variant hover:bg-surface-neutral"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-telegram-blue to-telegram-blue/90 text-white rounded-xl font-[var(--font-ibm-plex)] text-label-md hover:opacity-90 elevation-1 justify-center h-auto py-2.5 mt-2"
          >
            <a
              href="https://t.me/DrugWise30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="w-4 h-4" />
              {t("joinTelegram")}
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
}
