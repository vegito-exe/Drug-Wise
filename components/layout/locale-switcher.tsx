"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const switchLocale = () => {
    const nextLocale = locale === "fr" ? "ar" : "fr";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={switchLocale}
      aria-label={t("switchLanguage")}
      className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors font-[var(--font-ibm-plex)] text-label-sm"
      id="locale-switcher"
    >
      <Languages className="w-4 h-4 shrink-0" />
      <span className="hidden sm:inline">{t("switchLanguage")}</span>
    </button>
  );
}
