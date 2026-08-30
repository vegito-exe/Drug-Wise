import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import {
  Send,
  Clock,
  CheckCircle,
  Star,
  FlaskConical,
  Syringe,
  Pill,
  MessageSquare,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "@/i18n/navigation";
import type { Question } from "@/lib/generated/prisma/client";
import AskQuestionForm, {
  type ModuleOption,
} from "@/components/questions/ask-question-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function MyQuestionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user?.role === "ADMIN") {
    redirect({ href: "/admin/questions", locale });
  }

  const [questions, modules] = await Promise.all([
    prisma.question.findMany({
      where: { studentId: session!.user.id },
      orderBy: { createdAt: "desc" },
      include: { module: true, faqEntry: { select: { id: true } } },
    }),
    prisma.module.findMany({
      include: { year: true },
      orderBy: [{ year: { number: "asc" } }, { order: "asc" }],
    }),
  ]);

  const moduleOptions: ModuleOption[] = modules.map((m) => ({
    id: m.id,
    nameFr: m.nameFr,
    nameAr: m.nameAr,
    yearNumber: m.year.number,
  }));

  return (
    <MyQuestionsContent
      questions={questions}
      moduleOptions={moduleOptions}
    />
  );
}

type HistoryQuestion = Question & {
  module: { nameFr: string; nameAr: string } | null;
  faqEntry: { id: string } | null;
};

function MyQuestionsContent({
  questions,
  moduleOptions,
}: {
  questions: HistoryQuestion[];
  moduleOptions: ModuleOption[];
}) {
  const t = useTranslations("myQuestions");
  const locale = useLocale();

  const totalAsked = questions.length;
  const answered = questions.filter((q) => q.status === "answered").length;
  const pending = questions.filter((q) => q.status === "pending").length;

  const moduleIcons: Record<string, React.ElementType> = {
    Pharmacologie: Syringe,
    "علم الأدوية": Syringe,
    Biochimie: FlaskConical,
    "الكيمياء الحيوية": FlaskConical,
    "Pharmacie clinique": Pill,
    "الصيدلة السريرية": Pill,
  };

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      {/* Header */}
      <div className="mb-stack-lg">
        <h1 className="font-[var(--font-manrope)] text-headline-lg-mobile md:text-headline-lg text-primary font-bold mb-2">
          {t("title")}
        </h1>
        <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant max-w-2xl">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* ── Left Column: Form + Stats ── */}
        <div className="lg:col-span-1 space-y-stack-md">
          {/* Submit Form */}
          <Card
            className="glass-card bg-white shadow-sm relative overflow-hidden [--card-spacing:--spacing(6)]"
            id="question-form"
          >
            <div className="absolute top-0 end-0 p-4 opacity-5 pointer-events-none">
              <MessageSquare className="w-20 h-20 text-primary" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                {t("submitNew")}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <AskQuestionForm modules={moduleOptions} />
              <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant text-center opacity-70 mt-4">
                {t("privacyNote")}
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card
            className="bg-white shadow-sm border border-surface-container-high [--card-spacing:--spacing(6)]"
            id="question-stats"
          >
            <CardHeader className="pb-0">
              <CardTitle className="font-[var(--font-ibm-plex)] text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                {t("questionStats")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-[var(--font-inter)] text-body-sm text-on-surface">
                  {t("totalAsked")}
                </span>
                <span className="font-[var(--font-manrope)] text-headline-sm text-primary font-bold">
                  {totalAsked}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-[var(--font-inter)] text-body-sm text-on-surface flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-answered" />
                  {t("answered")}
                </span>
                <span className="font-[var(--font-manrope)] text-headline-sm text-status-answered font-bold">
                  {answered}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-[var(--font-inter)] text-body-sm text-on-surface flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-pending pulse-animation" />
                  {t("pending")}
                </span>
                <span className="font-[var(--font-manrope)] text-headline-sm text-status-pending font-bold">
                  {pending}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Question History ── */}
        <div className="lg:col-span-2 space-y-stack-md">
          {/* History Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-surface-container-high">
            <h2 className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold">
              {t("yourHistory")}
            </h2>
          </div>

          {/* Question Items */}
          {questions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-surface-container-high p-8 text-center">
              <MessageSquare className="w-10 h-10 text-primary/40 mx-auto mb-3" />
              <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant">
                {t("emptyHistory")}
              </p>
            </div>
          ) : (
            questions.map((q) => {
              const moduleName = q.module
                ? locale === "ar"
                  ? q.module.nameAr
                  : q.module.nameFr
                : null;
              const ModIcon =
                (moduleName && moduleIcons[moduleName]) || MessageSquare;
              const promotedToFaq = q.faqEntry !== null;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl shadow-sm border border-surface-container-high p-6 transition-all hover:shadow-md relative overflow-hidden ${
                    q.status === "answered"
                      ? "border-s-4 border-s-status-answered"
                      : ""
                  }`}
                  id={`question-${q.id}`}
                >
                  {/* FAQ ribbon */}
                  {promotedToFaq && (
                    <div className="absolute -end-6 top-4 bg-teal-success text-white text-xs font-bold py-1 px-8 rotate-45 rtl:-rotate-45 shadow-sm">
                      FAQ
                    </div>
                  )}

                  {/* Question Meta */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-container w-10 h-10 rounded-lg flex items-center justify-center text-primary">
                        <ModIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                          {moduleName ?? t("noModule")}
                        </span>
                        <span className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant ms-2">
                          {new Date(q.createdAt).toLocaleDateString(
                            locale === "ar" ? "ar-DZ" : "fr-FR",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`gap-1 px-3 py-1 rounded-full border h-auto ${
                        q.status === "pending"
                          ? "bg-amber-50 text-status-pending border-amber-200"
                          : "bg-emerald-50 text-status-answered border-emerald-200"
                      }`}
                    >
                      {q.status === "pending" ? (
                        <Clock className="w-4 h-4 pulse-animation" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span className="font-[var(--font-ibm-plex)] text-label-sm font-semibold">
                        {q.status === "pending"
                          ? t("pending")
                          : t("answered")}
                      </span>
                    </Badge>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-[var(--font-inter)] text-body-lg text-on-surface font-medium mb-3">
                    {q.questionText}
                  </h3>

                  {/* Answer or Pending */}
                  {q.status === "pending" ? (
                    <div className="bg-surface-neutral p-4 rounded-lg border border-surface-container border-dashed flex items-center gap-3 text-on-surface-variant">
                      <Clock className="w-5 h-5 text-primary pulse-animation" />
                      <p className="font-[var(--font-inter)] text-body-sm">
                        {t("pendingReview")}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`p-5 rounded-lg border ${
                        promotedToFaq
                          ? "bg-surface-neutral border-surface-container"
                          : "bg-medical-blue-light border-primary-fixed-dim"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3 border-b border-primary-fixed-dim pb-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                          S
                        </div>
                        <span className="font-[var(--font-ibm-plex)] text-label-md text-primary font-semibold">
                          {t("sabrinesResponse")}
                        </span>
                        {promotedToFaq && (
                          <span className="ms-auto text-xs text-teal-success flex items-center gap-1 font-medium bg-teal-success/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3.5 h-3.5" />{" "}
                            {t("promotedToFaq")}
                          </span>
                        )}
                      </div>
                      <div className="font-[var(--font-inter)] text-body-sm text-on-surface space-y-2">
                        {q.answerText?.split("\n\n").map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
