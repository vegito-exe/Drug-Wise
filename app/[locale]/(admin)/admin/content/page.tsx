import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import ContentManager from "@/components/admin/content-manager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const years = await prisma.year.findMany({
    orderBy: { number: "asc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { contentItems: { orderBy: { createdAt: "desc" } } },
      },
    },
  });

  return (
    <ContentManager
      data={{
        years: years.map((y) => ({
          id: y.id,
          number: y.number,
          labelFr: y.labelFr,
          labelAr: y.labelAr,
          totalCoefficient: y.totalCoefficient,
          modules: y.modules.map((m) => ({
            id: m.id,
            nameFr: m.nameFr,
            nameAr: m.nameAr,
            coefficient: m.coefficient,
            order: m.order,
            icon: m.icon,
            contentItems: m.contentItems.map((c) => ({
              id: c.id,
              type: c.type,
              titleFr: c.titleFr,
              titleAr: c.titleAr,
              description: c.description,
              fileName: c.fileName,
              fileUrl: c.fileUrl,
            })),
          })),
        })),
      }}
    />
  );
}
