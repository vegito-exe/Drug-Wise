"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Search,
  LayoutGrid,
  Stethoscope,
  FlaskConical,
  Calculator,
  HeadphonesIcon,
  Lock,
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { FAQEntry, FAQCategory } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 10;

const CATEGORY_VALUES: (FAQCategory | null)[] = [
  null,
  "CLINICAL_PRACTICE",
  "PHARMACOLOGY",
  "CALCULATIONS",
  "PLATFORM_SUPPORT",
];

const CATEGORY_KEYS = [
  "allQuestions",
  "clinicalPractice",
  "pharmacology",
  "calculations",
  "platformSupport",
] as const;

const CATEGORY_ICONS = [LayoutGrid, Stethoscope, FlaskConical, Calculator, HeadphonesIcon];

export default function FaqContent({ entries }: { entries: (FAQEntry & { sourceQuestionId: string | null })[] }) {
  const t = useTranslations("faq");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = entries;

    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.questionFr.toLowerCase().includes(q) ||
          e.questionAr.toLowerCase().includes(q) ||
          e.answerFr.toLowerCase().includes(q) ||
          e.answerAr.toLowerCase().includes(q)
      );
    }

    return result;
  }, [entries, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const featured = paginated[0];
  const rest = paginated.slice(1);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-stack-lg">
      {/* Hero */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="font-[var(--font-manrope)] text-display-lg text-primary">
          {t("heroTitle")}
        </h1>
        <p className="font-[var(--font-inter)] text-body-lg text-on-surface-variant">
          {t("heroDescription")}
        </p>
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
          <Input
            className="w-full ps-12 pe-4 py-4 h-auto rounded-full border-2 border-primary-fixed bg-surface-container-lowest text-body-md shadow-sm focus-visible:ring-primary-fixed-dim"
            placeholder={t("searchPlaceholder")}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-8">
        {/* Category Sidebar */}
        <aside className="md:col-span-3 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 soft-shadow sticky top-24">
            <h3 className="font-[var(--font-manrope)] text-headline-sm text-primary mb-4">
              {t("categories")}
            </h3>
            <nav className="space-y-2">
              {CATEGORY_KEYS.map((key, i) => {
                const Icon = CATEGORY_ICONS[i];
                const isActive = selectedCategory === CATEGORY_VALUES[i];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(CATEGORY_VALUES[i]);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg font-[var(--font-ibm-plex)] text-label-md transition-colors ${
                      isActive
                        ? "bg-primary-fixed text-on-primary-fixed-variant"
                        : "hover:bg-surface-container-low text-on-surface-variant"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {t(key)}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-outline-variant">
              <div className="bg-medical-blue-light rounded-xl p-4 text-center">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-[var(--font-ibm-plex)] text-label-md text-primary mb-2">
                  {t("cantFindAnswer")}
                </h4>
                <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant mb-4">
                  {t("askCommunity")}
                </p>
                <Button
                  asChild
                  className="w-full bg-primary text-on-primary rounded-lg hover:bg-primary-container shadow-sm font-[var(--font-ibm-plex)] text-label-md h-auto py-2"
                >
                  <Link href="/my-questions">{t("askQuestion")}</Link>
                </Button>
                <p className="font-[var(--font-ibm-plex)] text-label-sm text-outline mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  {t("askPrivately")}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main FAQ Content */}
        <div className="md:col-span-9 space-y-stack-lg">
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-outline mx-auto mb-4" />
              <p className="font-[var(--font-inter)] text-body-lg text-on-surface-variant">
                {t("noResults")}
              </p>
            </div>
          )}

          {featured && (
            <div className="glass-card rounded-2xl p-6 md:p-8 soft-shadow relative overflow-hidden">
              <div className="absolute top-0 end-0 w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-20 -me-20 -mt-20 pointer-events-none" />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-status-answered font-[var(--font-ibm-plex)] text-label-md">
                  <CheckCircle className="w-4 h-4" />
                  {t("promotedToFaq")}
                </div>
              </div>
              <h2 className="font-[var(--font-manrope)] text-headline-md text-primary mb-4">
                {locale === "ar" ? featured.questionAr : featured.questionFr}
              </h2>
              <div className="prose prose-sm md:prose-base max-w-none font-[var(--font-inter)] text-body-md text-on-surface-variant space-y-4">
                <p>{locale === "ar" ? featured.answerAr : featured.answerFr}</p>
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-[var(--font-manrope)] text-headline-sm text-on-surface mb-6 border-b border-outline-variant pb-2">
                {t("recentlyAnswered")}
              </h3>
              {rest.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-surface-container-lowest rounded-xl p-5 soft-shadow border border-surface-container-highest hover:border-primary-fixed-dim transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <h4 className="font-[var(--font-manrope)] text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
                        {locale === "ar" ? entry.questionAr : entry.questionFr}
                      </h4>
                      <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant line-clamp-2">
                        {locale === "ar" ? entry.answerAr : entry.answerFr}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-outline hover:bg-surface-container-low disabled:opacity-50"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="icon"
                    className={`w-10 h-10 rounded-lg font-[var(--font-ibm-plex)] text-label-md ${
                      page === safePage
                        ? "bg-primary text-on-primary"
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-on-surface hover:bg-surface-container-low disabled:opacity-50"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </Button>
              </nav>
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-center text-sm text-outline font-[var(--font-ibm-plex)]">
              {t("pageOf", { current: safePage, total: totalPages })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
