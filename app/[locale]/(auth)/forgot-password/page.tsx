import { setRequestLocale } from "next-intl/server";
import ForgotPasswordClient from "./page.client";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ForgotPasswordClient />;
}
