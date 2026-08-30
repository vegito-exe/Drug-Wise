"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Lock, CheckCircle } from "lucide-react";

export default function ResetPasswordClient() {
  const t = useTranslations("auth");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setError(t("errorInvalidToken"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (res.ok) {
        setDone(true);
      } else {
        setError(t("errorInvalidToken"));
      }
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="font-[var(--font-manrope)] text-headline-md">
              {t("passwordResetSuccess")}
            </CardTitle>
            <CardDescription className="font-[var(--font-inter)]">
              {t("passwordResetSuccessDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="mt-4">
              <Link href="/login">{t("login")}</Link>
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
            {t("resetPasswordTitle")}
          </CardTitle>
          <CardDescription className="font-[var(--font-inter)]">
            {t("resetPasswordDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("newPassword")}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="ps-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t("loading") : t("resetPassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
