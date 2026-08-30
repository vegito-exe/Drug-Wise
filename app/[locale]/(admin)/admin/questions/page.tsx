import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Clock, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ReplyForm from "@/components/admin/reply-form";
import PromoteToFaqButton from "@/components/admin/promote-to-faq-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      module: true,
      faqEntry: { select: { id: true } },
    },
  });

  return (
    <AdminQuestionsContent
      questions={questions.map((q) => ({
        id: q.id,
        studentName: q.student.name,
        studentEmail: q.student.email,
        moduleNameFr: q.module?.nameFr ?? null,
        moduleNameAr: q.module?.nameAr ?? null,
        questionText: q.questionText,
        answerText: q.answerText,
        status: q.status,
        createdAt: q.createdAt,
        answeredAt: q.answeredAt,
        promotedToFaq: q.faqEntry !== null,
      }))}
    />
  );
}

type AdminQuestion = {
  id: string;
  studentName: string;
  studentEmail: string;
  moduleNameFr: string | null;
  moduleNameAr: string | null;
  questionText: string;
  answerText: string | null;
  status: "pending" | "answered";
  createdAt: Date;
  answeredAt: Date | null;
  promotedToFaq: boolean;
};

function AdminQuestionsContent({
  questions,
}: {
  questions: AdminQuestion[];
}) {
  const t = useTranslations("admin.questions");

  const pending = questions.filter((q) => q.status === "pending");
  const answered = questions.filter((q) => q.status === "answered");

  return (
    <div className="space-y-stack-lg">
      <div>
        <h1 className="font-[var(--font-manrope)] text-headline-lg text-primary font-bold mb-2">
          {t("title")}
        </h1>
        <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant">
          {t("description")}
        </p>
      </div>

      <section>
        <h2 className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-status-pending" />
          {t("pendingSection")}
          <Badge className="rounded-full bg-amber-50 text-status-pending border border-amber-200">
            {pending.length}
          </Badge>
        </h2>
        {pending.length === 0 ? (
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
            {t("noPending")}
          </p>
        ) : (
          <div className="space-y-4">
            {pending.map((q) => (
              <QuestionCard key={q.id} q={q} showReply />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-status-answered" />
          {t("answeredSection")}
          <Badge className="rounded-full bg-emerald-50 text-status-answered border border-emerald-200">
            {answered.length}
          </Badge>
        </h2>
        {answered.length === 0 ? (
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
            {t("noAnswered")}
          </p>
        ) : (
          <div className="space-y-4">
            {answered.map((q) => (
              <QuestionCard key={q.id} q={q} showReply={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuestionCard({ q, showReply }: { q: AdminQuestion; showReply: boolean }) {
  const t = useTranslations("admin.questions");
  const locale = useLocale();

  const moduleName = q.moduleNameFr
    ? locale === "ar"
      ? q.moduleNameAr
      : q.moduleNameFr
    : t("general");

  return (
    <Card className="bg-white shadow-sm border border-surface-container-high [--card-spacing:--spacing(5)]">
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              {q.studentName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-[var(--font-inter)] text-body-sm text-on-surface font-semibold">
                {q.studentName}
              </p>
              <p className="font-[var(--font-inter)] text-body-xs text-on-surface-variant">
                {q.studentEmail} ·{" "}
                {new Date(q.createdAt).toLocaleDateString(
                  locale === "ar" ? "ar-DZ" : "fr-FR",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </p>
            </div>
          </div>
          <span className="font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
            {moduleName}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-[var(--font-inter)] text-body-md text-on-surface font-medium">
          {q.questionText}
        </p>

        {q.status === "answered" && q.answerText ? (
          <div>
            <div className="bg-medical-blue-light border-s-4 border-s-status-answered rounded-lg p-4">
              <p className="font-[var(--font-inter)] text-body-sm text-on-surface whitespace-pre-wrap">
                {q.answerText}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <PromoteToFaqButton
                questionId={q.id}
                alreadyPromoted={q.promotedToFaq}
              />
            </div>
          </div>
        ) : (
          showReply && <ReplyForm questionId={q.id} />
        )}
      </CardContent>
    </Card>
  );
}
