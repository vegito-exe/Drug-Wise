import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  Home,
  ChevronRight,
  ChevronLeft,
  FileText,
  ClipboardCheck,
  Clock,
  Pill,
  FlaskConical,
  TestTubes,
  Leaf,
  Syringe,
  ClipboardList,
  Store,
  Building2,
  Dna,
  Factory,
  Microscope,
  GraduationCap,
  Award,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import type {
  Year,
  Module,
  ContentItem,
  Rotation,
} from "@/lib/generated/prisma/client";
import DownloadButton from "@/components/download-button";

export const dynamic = "force-dynamic";

const iconMap: Record<string, React.ElementType> = {
  pill: Pill,
  "flask-round": FlaskConical,
  "test-tubes": TestTubes,
  leaf: Leaf,
  syringe: Syringe,
  "clipboard-list": ClipboardList,
  store: Store,
  "building-2": Building2,
  dna: Dna,
  factory: Factory,
  microscope: Microscope,
};

type YearWithModules = Year & {
  modules: (Module & { contentItems: ContentItem[] })[];
  rotations: Rotation[];
};

export default async function BrowseYearPage({
  params,
}: {
  params: Promise<{ locale: string; yearId: string }>;
}) {
  const { locale, yearId } = await params;
  setRequestLocale(locale);

  const yearNumber = parseInt(yearId, 10);

  const [years, year] = await Promise.all([
    prisma.year.findMany({ orderBy: { number: "asc" } }),
    prisma.year.findUnique({
      where: { number: yearNumber },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { contentItems: { orderBy: { createdAt: "desc" } } },
        },
        rotations: { orderBy: { order: "asc" } },
      },
    }),
  ]);

  if (!year) notFound();

  if (yearNumber === 6) return <Year6Content years={years} rotations={year.rotations} />;

  return <BrowseYearContent years={years} year={year} />;
}

function YearSidebar({
  years,
  yearNumber,
}: {
  years: Year[];
  yearNumber: number;
}) {
  const t = useTranslations("browse");
  const locale = useLocale();

  return (
    <nav
      className="hidden md:flex flex-col w-64 bg-surface-container-low p-4 space-y-stack-md flex-shrink-0 border-e border-surface-variant"
      id="year-sidebar"
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-[var(--font-manrope)] text-headline-sm font-bold text-secondary">
            {t("curriculum")}
          </h2>
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
            {t("modulesByYear")}
          </p>
        </div>
      </div>

      {/* Year Links */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {years.map((y) => (
          <Link
            key={y.id}
            href={`/years/${y.number}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${
              y.number === yearNumber
                ? "text-on-secondary-container bg-secondary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
            id={`sidebar-year-${y.number}`}
          >
            <span className="font-bold text-lg">{y.number}</span>
            <span className="font-[var(--font-ibm-plex)] text-label-md">
              {locale === "ar" ? y.labelAr : y.labelFr}
            </span>
          </Link>
        ))}
      </div>


    </nav>
  );
}

function MobileYearSelector({
  years,
  yearNumber,
}: {
  years: Year[];
  yearNumber: number;
}) {
  const locale = useLocale();

  return (
    <nav
      className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-6 -mx-margin-mobile px-margin-mobile"
      aria-label="Année"
      id="mobile-year-selector"
    >
      {years.map((y) => (
        <Link
          key={y.id}
          href={`/years/${y.number}`}
          className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full border font-[var(--font-ibm-plex)] text-label-sm transition-colors ${
            y.number === yearNumber
              ? "bg-secondary-container text-on-secondary-container border-secondary-container font-bold"
              : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container"
          }`}
          id={`mobile-year-${y.number}`}
        >
          <span className="font-bold">{y.number}</span>
          <span>{locale === "ar" ? y.labelAr : y.labelFr}</span>
        </Link>
      ))}
    </nav>
  );
}

function BrowseYearContent({
  years,
  year,
}: {
  years: Year[];
  year: YearWithModules;
}) {
  const t = useTranslations("browse");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const yearModules = year.modules;

  const yearLabel =
    locale === "ar" ? year.labelAr : year.labelFr;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-73px)]">
      {/* ── Side Navigation (Desktop) ── */}
      <YearSidebar years={years} yearNumber={year.number} />

      {/* ── Main Content ── */}
      <div className="flex-1 bg-surface-neutral">
        <div className="p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex text-on-surface-variant font-[var(--font-ibm-plex)] text-label-sm mb-6"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4 me-1" />
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <Chevron className="w-4 h-4 mx-1" />
                  <span className="text-on-surface font-semibold">
                    {yearLabel}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Mobile Year Selector */}
          <MobileYearSelector years={years} yearNumber={year.number} />

          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-[var(--font-manrope)] text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
                {t("title", { year: year.number })}
              </h1>
              <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant mt-1">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter" id="modules-grid">
            {yearModules.map((mod) => {
              const modSummaries = mod.contentItems.filter(
                (c) => c.type === "summary"
              );
              const modQuizzes = mod.contentItems.filter(
                (c) => c.type === "quiz"
              );
              const IconComponent = iconMap[mod.icon] || Pill;

              return (
                <div
                  key={mod.id}
                  className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col"
                  id={`module-card-${mod.id}`}
                >
                  {/* Module Header */}
                  <div className="p-5 border-b border-surface-variant flex justify-between items-start bg-gradient-to-r from-medical-blue-light/50 to-transparent rtl:bg-gradient-to-l">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-[var(--font-manrope)] text-headline-sm font-bold text-on-surface">
                          {locale === "ar" ? mod.nameAr : mod.nameFr}
                        </h3>
                        <p className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant">
                          {locale === "ar" ? mod.nameFr : mod.nameAr}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant font-[var(--font-ibm-plex)] text-label-sm">
                      {t("coefficient")}: {mod.coefficient}
                    </span>
                  </div>

                  {/* Module Content */}
                  <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
                    {/* Summaries */}
                    <div>
                      <h4 className="font-[var(--font-ibm-plex)] text-label-md text-on-surface mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-secondary" />
                        {t("summaries")}
                      </h4>
                      {modSummaries.length > 0 ? (
                        <ul className="space-y-2">
                          {modSummaries.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-surface-neutral hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/50"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-error" />
                                <span className="font-[var(--font-inter)] text-body-sm text-on-surface">
                                  {locale === "ar" ? item.titleAr : item.titleFr}
                                </span>
                              </div>
                              <DownloadButton
                                fileUrl={item.fileUrl}
                                fileKey={item.fileKey}
                                title={item.titleFr}
                                className="text-on-surface-variant group-hover:text-primary"
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 rounded-lg border border-dashed border-outline-variant bg-surface-neutral flex flex-col items-center justify-center text-center">
                          <Clock className="w-5 h-5 text-outline mb-1" />
                          <p className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant">
                            {t("noSummaries")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quizzes */}
                    <div className="mt-auto pt-2">
                      <h4 className="font-[var(--font-ibm-plex)] text-label-md text-on-surface mb-3 flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-teal-success" />
                        {t("controlQuizzes")}
                      </h4>
                      {modQuizzes.length > 0 ? (
                        <ul className="space-y-2">
                          {modQuizzes.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-surface-neutral hover:bg-surface-container transition-colors group cursor-pointer border-s-4 border-s-teal-success border border-transparent hover:border-outline-variant/50"
                            >
                              <div className="flex items-center gap-3">
                                <ClipboardCheck className="w-5 h-5 text-teal-success" />
                                <span className="font-[var(--font-inter)] text-body-sm text-on-surface">
                                  {locale === "ar" ? item.titleAr : item.titleFr}
                                </span>
                              </div>
                              <DownloadButton
                                fileUrl={item.fileUrl}
                                fileKey={item.fileKey}
                                title={item.titleFr}
                                variant="link"
                                className="text-primary font-[var(--font-ibm-plex)] text-label-sm h-auto p-0"
                              >
                                {t("start")}
                              </DownloadButton>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 rounded-lg border border-dashed border-outline-variant bg-surface-neutral flex flex-col items-center justify-center text-center">
                          <Clock className="w-5 h-5 text-outline mb-1" />
                          <p className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant">
                            {t("quizzesComingSoon")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Year6Content({
  years,
  rotations,
}: {
  years: Year[];
  rotations: Rotation[];
}) {
  const t = useTranslations("browse");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Chevron = isRtl ? ChevronLeft : ChevronRight;
  const yearLabel = locale === "ar" ? "السنة السادسة" : "6ème Année";

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-73px)]">
      {/* ── Side Navigation (Desktop) ── */}
      <YearSidebar years={years} yearNumber={6} />

      {/* ── Main Content ── */}
      <div className="flex-1 bg-surface-neutral">
        <div className="p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex text-on-surface-variant font-[var(--font-ibm-plex)] text-label-sm mb-6"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center hover:text-primary transition-colors"
                >
                  <Home className="w-4 h-4 me-1" />
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <Chevron className="w-4 h-4 mx-1" />
                  <span className="text-on-surface font-semibold">{yearLabel}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Mobile Year Selector */}
          <MobileYearSelector years={years} yearNumber={6} />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-[var(--font-manrope)] text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
                {yearLabel}
              </h1>
              <span className="bg-secondary-container text-on-secondary-container font-[var(--font-ibm-plex)] text-label-sm px-3 py-1 rounded-full">
                {t("year6Badge")}
              </span>
            </div>
            <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant max-w-3xl">
              {t("year6Intro")}
            </p>
          </div>

          {/* Rotations */}
          <div className="mb-6">
            <h2 className="font-[var(--font-manrope)] text-headline-sm text-on-surface">
              {t("internships")}
            </h2>
            <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant mt-1">
              {t("internshipsSub")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter" id="year6-rotations">
            {rotations.map((rot, i) => {
              const IconComponent = iconMap[rot.icon] || Pill;
              return (
                <div
                  key={rot.id}
                  className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col"
                  id={`rotation-${rot.id}`}
                >
                  <div className="p-5 flex items-center gap-4 bg-gradient-to-r from-medical-blue-light/50 to-transparent rtl:bg-gradient-to-l border-b border-surface-variant">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-[var(--font-manrope)] text-headline-sm font-bold text-on-surface">
                        {locale === "ar" ? rot.nameAr : rot.nameFr}
                      </h3>
                      <p className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant">
                        {locale === "ar" ? rot.nameFr : rot.nameAr}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex items-center gap-3 bg-white">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
                      {locale === "ar" ? rot.disciplinesAr : rot.disciplinesFr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thesis card */}
          <div
            className="mt-8 glass-card rounded-2xl p-6 md:p-8 soft-shadow relative overflow-hidden border border-secondary-container"
            id="year6-thesis"
          >
            <div className="absolute top-0 end-0 w-64 h-64 bg-secondary-container rounded-full blur-3xl opacity-20 -me-20 -mt-20 pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-fixed flex items-center justify-center flex-shrink-0 shadow-sm">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-[var(--font-manrope)] text-headline-sm text-primary font-bold">
                    {t("thesis")}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-teal-success font-medium bg-teal-success/10 px-2 py-0.5 rounded-full">
                    <Award className="w-3.5 h-3.5" />
                    {t("thesisSub")}
                  </span>
                </div>
                <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
                  {t("thesisDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
