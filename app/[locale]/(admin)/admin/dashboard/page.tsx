import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  MessagesSquare,
  FileText,
  FolderOpen,
  GraduationCap,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [pendingQuestions, totalContent, totalModules, totalFaq, totalYears, recentQuestions] =
    await Promise.all([
      prisma.question.count({ where: { status: "pending" } }),
      prisma.contentItem.count(),
      prisma.module.count(),
      prisma.fAQEntry.count(),
      prisma.year.count(),
      prisma.question.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { student: true, module: true },
      }),
    ]);

  return (
    <AdminDashboardContent
      pendingQuestions={pendingQuestions}
      totalContent={totalContent}
      totalModules={totalModules}
      totalFaq={totalFaq}
      totalYears={totalYears}
      recentQuestions={recentQuestions.map((q) => ({
        id: q.id,
        studentName: q.student.name,
        moduleNameFr: q.module?.nameFr ?? null,
        moduleNameAr: q.module?.nameAr ?? null,
        questionText: q.questionText,
        status: q.status,
        createdAt: q.createdAt,
      }))}
    />
  );
}

function AdminDashboardContent({
  pendingQuestions,
  totalContent,
  totalModules,
  totalFaq,
  totalYears,
  recentQuestions,
}: {
  pendingQuestions: number;
  totalContent: number;
  totalModules: number;
  totalFaq: number;
  totalYears: number;
  recentQuestions: {
    id: string;
    studentName: string;
    moduleNameFr: string | null;
    moduleNameAr: string | null;
    questionText: string;
    status: "pending" | "answered";
    createdAt: Date;
  }[];
}) {
  const t = useTranslations("admin.dashboard");

  const stats = [
    {
      label: t("pendingQuestions"),
      value: pendingQuestions,
      icon: MessagesSquare,
      href: "/admin/questions",
    },
    { label: t("totalContent"), value: totalContent, icon: FileText, href: "/admin/content" },
    { label: t("totalModules"), value: totalModules, icon: FolderOpen, href: "/admin/content" },
    { label: t("totalYears"), value: totalYears, icon: GraduationCap, href: "/admin/content" },
    { label: t("totalFaq"), value: totalFaq, icon: MessagesSquare, href: "/admin/faq" },
  ];

  return (
    <div className="space-y-stack-lg">
      <div>
        <h1 className="font-[var(--font-manrope)] text-headline-lg text-primary font-bold mb-2">
          {t("title")}
        </h1>
        <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant">
          {t("welcome")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-gutter">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="bg-white shadow-sm border border-surface-container-high hover:shadow-md transition-shadow [--card-spacing:--spacing(5)] h-full">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-[var(--font-manrope)] text-headline-md text-on-surface font-bold">
                  {s.value}
                </p>
                <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
                  {s.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-white shadow-sm border border-surface-container-high [--card-spacing:--spacing(6)]">
        <CardHeader>
          <CardTitle className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t("recentQuestions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentQuestions.length === 0 ? (
            <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
              {t("noRecentQuestions")}
            </p>
          ) : (
            recentQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-neutral border border-surface-container"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {q.studentName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-[var(--font-inter)] text-body-sm text-on-surface font-medium truncate">
                    {q.questionText}
                  </p>
                  <p className="font-[var(--font-inter)] text-body-xs text-on-surface-variant">
                    {q.studentName} ·{" "}
                    {q.moduleNameFr ?? t("general")} ·{" "}
                    {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-label-sm font-semibold px-2 py-1 rounded-full ${
                    q.status === "pending"
                      ? "bg-amber-50 text-status-pending border border-amber-200"
                      : "bg-emerald-50 text-status-answered border border-emerald-200"
                  }`}
                >
                  {q.status === "pending" ? t("pending") : t("answered")}
                </span>
              </div>
            ))
          )}
          <Link
            href="/admin/questions"
            className="inline-block font-[var(--font-ibm-plex)] text-label-md text-primary font-semibold hover:underline"
          >
            {t("viewAll")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
