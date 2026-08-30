import { setRequestLocale } from "next-intl/server";
import ResetPasswordClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResetPasswordClient />;
}
