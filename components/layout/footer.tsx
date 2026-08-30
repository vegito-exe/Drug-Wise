import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Send } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-white border-t border-outline-variant/40 w-full py-stack-lg px-margin-mobile md:px-margin-desktop mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Brand */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block group"
            id="footer-brand"
          >
            <img
              src="/logo-removebg-with-txt.svg"
              alt="DrugWise"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
            {t("tagline")}
          </p>
          <p className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant/70">
            {t("copyright")}
          </p>
        </div>

        {/* Stay Updated */}
        <div className="space-y-4">
          <h4 className="font-[var(--font-ibm-plex)] text-label-md text-on-surface font-bold">
            {t("stayUpdated")}
          </h4>
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant leading-relaxed">
            {t("telegramDescription")}
          </p>
          <a
            href="https://t.me/DrugWise30"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-telegram-blue to-telegram-blue/90 text-white px-5 py-2.5 rounded-xl font-[var(--font-ibm-plex)] text-label-md hover:opacity-90 elevation-1 hover:elevation-2 transition-all duration-200"
            id="footer-telegram"
          >
            <Send className="w-4 h-4" />
            {t("telegramChannel")}
          </a>
        </div>
      </div>
    </footer>
  );
}
