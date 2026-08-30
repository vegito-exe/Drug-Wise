import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import AuthForm from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    // DB not reachable — fall through to the signup form.
  }
  if (session) redirect({ href: "/", locale });

  return <AuthCard locale={locale} />;
}

function AuthCard({ locale }: { locale: string }) {
  const t = useTranslations("auth");

  return (
    <main className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop gradient-hero">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left decorative panel - hidden on mobile */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 text-center animate-fade-in-up">
          <img
            src="/logo-removebg-with-txt.svg"
            alt="DrugWise"
            className="w-56 h-56 object-contain mb-6 animate-float"
          />
          <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant max-w-xs">
            {locale === "ar"
              ? "انضم إلى مجتمعنا التعليمي وطوّر مهاراتك"
              : "Rejoignez notre communauté éducative"}
          </p>
        </div>

        {/* Auth card */}
        <Card className="w-full max-w-md elevation-2 border-outline-variant/40 animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <img
                src="/favicon.svg"
                alt="DrugWise"
                className="w-14 h-14 object-contain"
              />
            </div>
            <CardTitle className="font-[var(--font-manrope)] text-headline-md">
              {t("signupTitle")}
            </CardTitle>
            <CardDescription className="font-[var(--font-inter)] text-body-sm">
              {t("signupSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <AuthForm mode="signup" />
            <p className="mt-6 text-center text-sm text-on-surface-variant">
              {t("haveAccount")}{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:text-primary-container transition-colors"
              >
                {t("loginLink")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
