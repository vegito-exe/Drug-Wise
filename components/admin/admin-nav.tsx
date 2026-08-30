"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  FileText,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminNav() {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  const items = [
    { href: "/admin/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/questions", label: t("questions"), icon: MessagesSquare },
    { href: "/admin/content", label: t("content"), icon: FolderOpen },
    { href: "/admin/faq", label: t("faq"), icon: FileText },
  ];

  return (
    <nav className="flex lg:flex-col gap-2" aria-label="Admin">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-label-md transition-colors",
              active
                ? "bg-primary/10 text-primary font-semibold"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
