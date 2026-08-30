import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    // DB unreachable — redirect to login rather than exposing a student page.
  }
  if (!session) redirect({ href: "/login", locale });

  return <>{children}</>;
}
