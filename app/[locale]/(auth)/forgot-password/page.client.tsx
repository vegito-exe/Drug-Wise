"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordClient() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo: "/reset-password" }),
      });

      if (!res.ok && res.status !== 200) {
        setError(t("errorGeneric"));
      } else {
        setSent(true);
      }
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="font-[var(--font-manrope)] text-headline-md">
              {t("resetEmailSent")}
            </CardTitle>
            <CardDescription className="font-[var(--font-inter)]">
              {t("resetEmailSentDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="mt-4">
              <Link href="/login">{t("backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Pill className="w-10 h-10 text-primary" strokeWidth={2.5} />
          </div>
          <CardTitle className="font-[var(--font-manrope)] text-headline-md">
            {t("forgotPasswordTitle")}
          </CardTitle>
          <CardDescription className="font-[var(--font-inter)]">
            {t("forgotPasswordDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="ps-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t("loading") : t("sendResetLink")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t("loginLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
