import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  ClipboardCheck,
  Send,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DownloadButton from "@/components/download-button";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    // not logged in
  }

  const [years, latestItems, myQuestions] = await Promise.all([
    prisma.year.findMany({ orderBy: { number: "asc" } }),
    prisma.contentItem.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { module: { include: { year: true } } },
    }),
    session
      ? prisma.question.findMany({
          where: { studentId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: 4,
          select: {
            id: true,
            questionText: true,
            status: true,
            createdAt: true,
          },
        })
      : [],
  ]);

  return (
    <HomeContent
      years={years}
      latestItems={latestItems}
      myQuestions={myQuestions}
      isLoggedIn={!!session}
    />
  );
}

function HomeContent({
  years,
  latestItems,
  myQuestions,
  isLoggedIn,
}: {
  years: { id: number; number: number; labelFr: string; labelAr: string }[];
  latestItems: {
    id: string;
    type: "summary" | "quiz";
    titleFr: string;
    titleAr: string;
    fileUrl: string | null;
    fileKey: string | null;
    module: {
      year: { number: number };
      nameFr: string;
      nameAr: string;
    };
  }[];
  myQuestions: {
    id: string;
    questionText: string;
    status: string;
    createdAt: Date;
  }[];
  isLoggedIn: boolean;
}) {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      {/* ── Hero Section ── */}
      <section
        className="relative gradient-hero rounded-3xl p-8 md:p-14 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10 ring-1 ring-inset ring-white/50 elevation-2"
        id="hero-section"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 dot-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
        <div className="absolute top-0 end-0 w-80 h-80 bg-gradient-to-bl from-primary/8 via-primary-fixed/40 to-transparent rounded-full blur-2xl -translate-y-1/3 translate-x-1/4 rtl:-translate-x-1/4" />
        <div className="absolute bottom-0 start-1/3 w-72 h-72 bg-gradient-to-tr from-pharmacy/12 via-pharmacy-soft to-transparent rounded-full blur-2xl translate-y-1/3" />
        <div className="absolute top-1/2 end-1/4 w-32 h-32 bg-gradient-to-br from-tertiary/5 to-transparent rounded-full blur-xl animate-float" />

        <div className="z-10 max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur border border-pharmacy/25 shadow-sm mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-pharmacy opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-pharmacy" />
            </span>
            <span className="font-[var(--font-ibm-plex)] text-label-sm text-pharmacy-deep">{t("heroBadge")}</span>
          </div>
          <h1 className="mb-5 w-full max-w-105">
            <img
              src="/logo-removebg-with-txt.svg"
              alt="DrugWise"
              className="h-auto w-full object-contain drop-shadow-sm"
            />
          </h1>
          <p className="font-[var(--font-inter)] text-body-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
            {t("heroDescription")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="gradient-primary text-on-primary px-8 py-3.5 rounded-xl font-[var(--font-ibm-plex)] text-label-md hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out elevation-2 hover:elevation-3 h-auto group"
              id="hero-browse"
            >
              <Link href="/years/3">
                {t("browseCourses")}
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/70 backdrop-blur-md text-primary border-primary/20 px-8 py-3.5 rounded-xl font-[var(--font-ibm-plex)] text-label-md hover:bg-white hover:border-pharmacy/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out elevation-1 hover:elevation-2 h-auto"
              id="hero-ask"
            >
              <Link href="/my-questions">{t("askQuestion")}</Link>
            </Button>
          </div>
        </div>

        {/* Floating decorative icon */}
        <div className="hidden md:flex items-center justify-center w-48 h-48 animate-float">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-3xl gradient-primary opacity-10 rotate-12" />
            <div className="absolute inset-0 rounded-3xl gradient-pharmacy opacity-10 -rotate-12 translate-x-3 translate-y-2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur border border-white/60 elevation-2 flex items-center justify-center">
                <svg className="w-14 h-14 text-pharmacy-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum by Year ── */}
      <section id="curriculum-section">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-[var(--font-manrope)] text-headline-md text-on-surface">
              <span className="block mb-2 h-1 w-8 rounded-full bg-gradient-to-r from-pharmacy to-teal-success" aria-hidden="true" />
              {t("curriculumByYear")}
            </h2>
            <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant mt-1">
              {t("curriculumByYearSub")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {years.map((year, index) => (
            <Link
              key={year.id}
              href={`/years/${year.number}`}
              className={`group relative bg-white rounded-2xl p-5 border border-outline-variant/60 elevation-1 card-interactive flex flex-col items-center text-center overflow-hidden animate-fade-in-up stagger-${(index % 6) + 1}`}
              id={`year-card-${year.number}`}
            >
              {/* Gradient accent on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/0 group-hover:from-primary/[0.03] group-hover:to-primary/[0.06] transition-all duration-300" />
              
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br from-surface-container-high to-surface-container group-hover:from-primary/10 group-hover:to-primary-fixed/50 transition-all duration-300">
                <span className="text-primary font-bold text-2xl font-[var(--font-manrope)]">
                  {year.number}
                </span>
              </div>
              <span className="relative font-[var(--font-ibm-plex)] text-label-md text-on-surface group-hover:text-primary transition-colors">
                {locale === "ar" ? year.labelAr : year.labelFr}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Latest Summaries */}
        <div className="lg:col-span-2 flex flex-col gap-stack-md">
          <div className="flex justify-between items-center">
            <h2 className="font-[var(--font-manrope)] text-headline-sm text-on-surface">
              <span className="block mb-2 h-1 w-8 rounded-full bg-gradient-to-r from-pharmacy to-teal-success" aria-hidden="true" />
              {t("latestSummaries")}
            </h2>
            <Button
              asChild
              variant="link"
              size="sm"
              className="font-[var(--font-ibm-plex)] text-label-sm text-primary p-0 h-auto"
              id="view-all-summaries"
            >
              <Link href="/years/3">{t("viewAll")}</Link>
            </Button>
          </div>
          <div className="bg-white rounded-2xl border border-outline-variant/60 elevation-1 overflow-hidden">
            {latestItems.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high mx-auto mb-3 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-outline" />
                </div>
                <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
                  {t("noContentYet")}
                </p>
              </div>
            ) : (
            latestItems.map((item, i) => (
              <div
                key={item.id}
                className={`p-4 flex items-center gap-4 hover:bg-gradient-to-r hover:from-surface-neutral hover:to-white transition-all duration-200 ${
                  i < latestItems.length - 1 ? "border-b border-outline-variant/40" : ""
                } ${item.type === "quiz" ? "border-s-4 border-s-teal-success" : ""}`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.type === "quiz"
                      ? "bg-gradient-to-br from-teal-success/15 to-teal-success/5"
                      : item.type === "summary"
                      ? "bg-gradient-to-br from-error-container/60 to-error-container/30"
                      : "bg-gradient-to-br from-primary/10 to-primary-fixed/50"
                  }`}
                >
                  {item.type === "quiz" ? (
                    <ClipboardCheck className="w-5 h-5 text-teal-success" />
                  ) : (
                    <FileText className="w-5 h-5 text-error" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-[var(--font-ibm-plex)] text-label-md text-on-surface truncate">
                    {locale === "ar" ? item.titleAr : item.titleFr}
                  </h4>
                  <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant truncate">
                    {locale === "ar"
                      ? `${t("yearShort", { year: item.module.year.number })} • ${item.module.nameAr}`
                      : `${t("yearShort", { year: item.module.year.number })} • ${item.module.nameFr}`}
                  </p>
                </div>
                <DownloadButton
                  fileUrl={item.fileUrl}
                  fileKey={item.fileKey}
                  title={item.titleFr}
                  className="text-outline hover:text-primary hover:bg-primary/5 p-2 rounded-lg transition-all duration-200"
                />
              </div>
            ))
            )}
          </div>
        </div>

        {/* Q&A Corner + Telegram */}
        <div className="flex flex-col gap-stack-md">
          <div className="flex justify-between items-center">
            <h2 className="font-[var(--font-manrope)] text-headline-sm text-on-surface">
              <span className="block mb-2 h-1 w-8 rounded-full bg-gradient-to-r from-pharmacy to-teal-success" aria-hidden="true" />
              {t("qaCorner")}
            </h2>
            <Button
              asChild
              variant="link"
              size="sm"
              className="font-[var(--font-ibm-plex)] text-label-sm text-primary p-0 h-auto"
              id="qa-ask-link"
            >
              <Link href="/my-questions">{t("ask")}</Link>
            </Button>
          </div>
          <div className="bg-white rounded-2xl border border-outline-variant/60 elevation-1 p-4 flex flex-col gap-4">
            {!isLoggedIn ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/5 mx-auto mb-3 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary/40" />
                </div>
                <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
                  {t("loginToSeeQuestions")}
                </p>
              </div>
            ) : myQuestions.length === 0 ? (
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high mx-auto mb-3 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-outline" />
                </div>
                <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
                  {t("noQuestionsYet")}
                </p>
              </div>
            ) : (
              myQuestions.map((q, i) => (
                <div key={q.id}>
                  {i > 0 && <hr className="border-outline-variant/40 my-2" />}
                  <div className="flex gap-3 p-2 rounded-xl hover:bg-surface-neutral/50 transition-colors">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${q.status === "ANSWERED" ? "bg-gradient-to-br from-teal-success to-teal-success/80" : "bg-gradient-to-br from-primary to-primary/80"}`}>
                      {q.status === "ANSWERED" ? "✓" : "…"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-[var(--font-ibm-plex)] text-label-md text-on-surface leading-tight line-clamp-2">
                        {q.questionText}
                      </p>
                      <span className="font-[var(--font-inter)] text-caption-xs text-on-surface-variant mt-1">
                        {new Date(q.createdAt).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Telegram Promo */}
          <div className="mt-4 rounded-2xl p-6 border elevation-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pharmacy-soft via-pharmacy-faint to-pharmacy-soft" />
            <div className="relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharmacy-deep to-pharmacy flex items-center justify-center mb-3 elevation-1">
                <Megaphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-[var(--font-manrope)] text-headline-sm text-on-surface mb-1">
                {t("joinCommunity")}
              </h3>
            <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant mb-4">
              {t("communityDescription")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pharmacy-deep to-pharmacy text-white rounded-xl font-[var(--font-ibm-plex)] text-label-md hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out elevation-1 hover:elevation-2 w-full h-auto py-2.5"
              id="home-telegram-cta"
            >
              <a
                href="https://t.me/DrugWise30"
                target="_blank"
                rel="noopener noreferrer"
                className="justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t("joinNow")}
              </a>
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
