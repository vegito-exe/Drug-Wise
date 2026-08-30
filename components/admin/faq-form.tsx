"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { createFaqEntry, updateFaqEntry } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FAQFormEntry {
  id: string;
  questionFr: string | null;
  questionAr: string | null;
  answerFr: string | null;
  answerAr: string | null;
  category?: string | null;
}

export default function FAQForm({
  mode,
  entry,
  onDone,
}: {
  mode: "create" | "edit";
  entry?: FAQFormEntry;
  onDone?: () => void;
}) {
  const t = useTranslations("admin.faq");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = z.object({
    questionFr: z.string().min(1, t("errorRequired")),
    questionAr: z.string().min(1, t("errorRequired")),
    answerFr: z.string().min(1, t("errorRequired")),
    answerAr: z.string().min(1, t("errorRequired")),
    category: z.enum(["CLINICAL_PRACTICE", "PHARMACOLOGY", "CALCULATIONS", "PLATFORM_SUPPORT"]).optional(),
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      questionFr: entry?.questionFr ?? "",
      questionAr: entry?.questionAr ?? "",
      answerFr: entry?.answerFr ?? "",
      answerAr: entry?.answerAr ?? "",
      category: (entry?.category as "CLINICAL_PRACTICE" | "PHARMACOLOGY" | "CALCULATIONS" | "PLATFORM_SUPPORT" | undefined) ?? undefined,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result =
      mode === "create"
        ? await createFaqEntry(values)
        : await updateFaqEntry(entry!.id, values);
    if (!result.ok) {
      setServerError(t("errorGeneric"));
      return;
    }
    onDone?.();
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="faq-qfr">{t("questionFr")}</Label>
          <Input id="faq-qfr" {...register("questionFr")} />
          {errors.questionFr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="faq-qar">{t("questionAr")}</Label>
          <Input id="faq-qar" dir="rtl" {...register("questionAr")} />
          {errors.questionAr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <Label>{t("category")}</Label>
        <Select value={watch("category") ?? ""} onValueChange={(v: string) => setValue("category", v as "CLINICAL_PRACTICE" | "PHARMACOLOGY" | "CALCULATIONS" | "PLATFORM_SUPPORT")}>
          <SelectTrigger className="bg-surface-neutral text-body-sm">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CLINICAL_PRACTICE">{t("catClinical")}</SelectItem>
            <SelectItem value="PHARMACOLOGY">{t("catPharmacology")}</SelectItem>
            <SelectItem value="CALCULATIONS">{t("catCalculations")}</SelectItem>
            <SelectItem value="PLATFORM_SUPPORT">{t("catPlatform")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="faq-afr">{t("answerFr")}</Label>
          <Textarea id="faq-afr" rows={4} {...register("answerFr")} />
          {errors.answerFr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="faq-aar">{t("answerAr")}</Label>
          <Textarea id="faq-aar" dir="rtl" rows={4} {...register("answerAr")} />
          {errors.answerAr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
      </div>
      {serverError && (
        <p className="text-error text-sm" role="alert">
          {serverError}
        </p>
      )}
      <Button
        type="submit"
        size="sm"
        className="gap-1.5 bg-primary text-primary-foreground hover:bg-on-primary-fixed-variant"
        disabled={isSubmitting}
      >
        <Save className="w-4 h-4" />
        {isSubmitting ? t("saving") : mode === "create" ? t("create") : t("save")}
      </Button>
    </form>
  );
}
