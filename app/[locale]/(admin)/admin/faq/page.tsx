import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FAQForm from "@/components/admin/faq-form";
import FAQEntryCard from "@/components/admin/faq-entry-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const entries = await prisma.fAQEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminFaqContent
      entries={entries.map((e) => ({
        id: e.id,
        questionFr: e.questionFr,
        questionAr: e.questionAr,
        answerFr: e.answerFr,
        answerAr: e.answerAr,
      }))}
    />
  );
}

function AdminFaqContent({
  entries,
}: {
  entries: {
    id: string;
    questionFr: string | null;
    questionAr: string | null;
    answerFr: string | null;
    answerAr: string | null;
  }[];
}) {
  const t = useTranslations("admin.faq");

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

      <Card className="bg-white shadow-sm border border-surface-container-high [--card-spacing:--spacing(6)]">
        <CardHeader>
          <CardTitle className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t("newEntry")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FAQForm mode="create" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface-variant">
            {t("noEntries")}
          </p>
        ) : (
          entries.map((entry) => (
            <FAQEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
}
