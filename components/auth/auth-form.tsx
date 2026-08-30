"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = z.object({
    name: mode === "signup" ? z.string().min(2, t("errorNameMin")) : z.string().optional(),
    email: z.string().email(t("errorEmailInvalid")),
    password: z.string().min(8, t("errorPasswordMin")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    if (mode === "signup") {
      const { error } = await authClient.signUp.email({
        name: values.name ?? "",
        email: values.email,
        password: values.password,
      });
      if (error) {
        setServerError(
          error.status === 409 ? t("errorEmailExists") : t("errorGeneric")
        );
        return;
      }
    } else {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setServerError(t("errorInvalidCredentials"));
        return;
      }
    }
    router.push("/");
    router.refresh();
  });

  return (
    <>
    <form onSubmit={onSubmit} className="space-y-5 w-full max-w-md" noValidate>
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="auth-name" className="text-label-md font-[var(--font-ibm-plex)]">{t("name")}</Label>
          <Input
            id="auth-name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className="h-11 rounded-xl border-outline-variant/60 focus:border-primary focus:ring-primary/20"
            {...register("name")}
          />
          {errors.name && <p className="text-error text-sm">{t("errorNameMin")}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="auth-email" className="text-label-md font-[var(--font-ibm-plex)]">{t("email")}</Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className="h-11 rounded-xl border-outline-variant/60 focus:border-primary focus:ring-primary/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-error text-sm">{t("errorEmailInvalid")}</p>
        )}
        {mode === "signup" && (
          <p className="text-xs text-on-surface-variant/70 mt-1">{t("emailNote")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="auth-password" className="text-label-md font-[var(--font-ibm-plex)]">{t("password")}</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder={t("passwordPlaceholder")}
          className="h-11 rounded-xl border-outline-variant/60 focus:border-primary focus:ring-primary/20"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-error text-sm">{t("errorPasswordMin")}</p>
        )}
      </div>

      {serverError && (
        <div className="bg-error/5 border border-error/20 rounded-xl p-3">
          <p className="text-error text-sm" role="alert">
            {serverError}
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full h-12 rounded-xl gradient-primary text-on-primary font-[var(--font-ibm-plex)] text-label-md elevation-1 hover:elevation-2 transition-all duration-200"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? <><Loader2 className="w-4 h-4 animate-spin me-2" />{t("loading")}</>
          : mode === "signup"
            ? t("signup")
            : t("login")}
      </Button>
    </form>

    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant/40" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-3 text-on-surface-variant/60 font-[var(--font-ibm-plex)]">{t("or")}</span>
      </div>
    </div>

    <Button
      variant="outline"
      size="lg"
      className="w-full h-12 rounded-xl border-outline-variant/60 hover:bg-surface-neutral hover:border-outline-variant transition-all duration-200 font-[var(--font-ibm-plex)]"
      onClick={() => authClient.signIn.social({ provider: "google" })}
      id="auth-google"
    >
      <svg className="w-5 h-5 me-2" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {t("continueWithGoogle")}
    </Button>
  </>
  );
}
