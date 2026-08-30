import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import AdminNav from "@/components/admin/admin-nav";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect({ href: session?.user ? "/" : "/login", locale });
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
      <aside className="lg:w-60 shrink-0 bg-surface-container-low border-e border-surface-variant p-4 lg:min-h-[calc(100vh-73px)]">
        <AdminNav />
      </aside>
      <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
