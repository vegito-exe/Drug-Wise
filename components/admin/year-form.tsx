"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { createYear, updateYear } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface YearFormData {
  id: number;
  number: number;
  labelFr: string;
  labelAr: string;
  totalCoefficient: number;
}

export default function YearForm({
  mode,
  year,
  onDone,
}: {
  mode: "create" | "edit";
  year?: YearFormData;
  onDone?: () => void;
}) {
  const t = useTranslations("admin.content");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = z.object({
    number: z.coerce.number().int().min(1).max(6),
    labelFr: z.string().min(1, t("errorRequired")),
    labelAr: z.string().min(1, t("errorRequired")),
    totalCoefficient: z.coerce.number().int().min(0).max(100),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      number: year?.number ?? 6,
      labelFr: year?.labelFr ?? "",
      labelAr: year?.labelAr ?? "",
      totalCoefficient: year?.totalCoefficient ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result =
      mode === "create"
        ? await createYear(values)
        : await updateYear(year!.id, values);
    if (!result.ok) {
      setServerError(
        result.error === "A year with this number already exists"
          ? t("errorYearExists")
          : t("errorGeneric")
      );
      return;
    }
    onDone?.();
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{t("number")}</Label>
          <Input
            type="number"
            min={1}
            max={6}
            {...register("number")}
            disabled={mode === "edit"}
          />
          {errors.number && (
            <p className="text-error text-sm">{t("errorNumber")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>{t("totalCoefficient")}</Label>
          <Input
            type="number"
            min={0}
            max={100}
            {...register("totalCoefficient")}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{t("labelFr")}</Label>
          <Input {...register("labelFr")} />
          {errors.labelFr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>{t("labelAr")}</Label>
          <Input dir="rtl" {...register("labelAr")} />
          {errors.labelAr && (
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
        {isSubmitting ? t("saving") : mode === "create" ? t("addYear") : t("save")}
      </Button>
    </form>
  );
}
