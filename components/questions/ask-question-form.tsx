"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Lock } from "lucide-react";
import { askQuestion } from "@/lib/actions/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ModuleOption {
  id: string;
  nameFr: string;
  nameAr: string;
  yearNumber: number;
}

export default function AskQuestionForm({
  modules,
}: {
  modules: ModuleOption[];
}) {
  const t = useTranslations("myQuestions");
  const locale = useLocale();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const schema = z.object({
    moduleId: z.string().optional(),
    questionText: z
      .string()
      .min(10, t("errorMinLength"))
      .max(2000, t("errorMaxLength")),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { moduleId: "general", questionText: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSubmitted(false);
    const result = await askQuestion({
      ...values,
      moduleId:
        values.moduleId === "general" ? undefined : values.moduleId,
    });
    if (result.status === "error") {
      setServerError(
        result.code === "rateLimit"
          ? t("errorRateLimit")
          : result.code === "notAuthenticated"
            ? t("errorNotAuthenticated")
            : t("errorGeneric")
      );
      return;
    }
    setSubmitted(true);
    reset();
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label
          className="block font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant mb-1"
          htmlFor="module-select"
        >
          {t("selectModule")}
        </label>
        <Controller
          name="moduleId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="module-select"
                className="w-full bg-surface-neutral text-body-sm text-on-surface data-placeholder:text-on-surface-variant"
              >
                <SelectValue placeholder={t("chooseModule")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t("noModule")}</SelectItem>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {locale === "ar" ? m.nameAr : m.nameFr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.moduleId && (
          <p className="text-error text-sm mt-1">{t("errorGeneric")}</p>
        )}
      </div>
      <div>
        <label
          className="block font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant mb-1"
          htmlFor="question-text"
        >
          {t("yourQuestion")}
        </label>
        <Textarea
          className="bg-surface-neutral text-body-sm text-on-surface resize-none min-h-[96px]"
          id="question-text"
          placeholder={t("questionPlaceholder")}
          rows={4}
          {...register("questionText")}
        />
        {errors.questionText && (
          <p className="text-error text-sm mt-1">{errors.questionText.message}</p>
        )}
      </div>
      {serverError && (
        <p className="text-error text-sm" role="alert">
          {serverError}
        </p>
      )}
      {submitted && (
        <p className="text-status-answered text-sm font-medium" role="status">
          {t("successSubmitted")}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full py-3 h-auto rounded-lg bg-primary text-primary-foreground hover:bg-on-primary-fixed-variant shadow-sm font-[var(--font-ibm-plex)] text-label-md"
        disabled={isSubmitting}
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? t("sending") : t("submitToSabrine")}
      </Button>
      <p className="font-[var(--font-ibm-plex)] text-label-sm text-outline text-center flex items-center justify-center gap-1">
        <Lock className="w-3.5 h-3.5" />
        {t("privacyNote")}
      </p>
    </form>
  );
}
