import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import FaqContent from "@/components/faq/faq-content";

export const dynamic = "force-dynamic";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const entries = await prisma.fAQEntry.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      questionFr: true,
      questionAr: true,
      answerFr: true,
      answerAr: true,
      category: true,
      sourceQuestionId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return <FaqContent entries={entries} />;
}
