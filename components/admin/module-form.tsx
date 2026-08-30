"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { createModule, updateModule } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ModuleFormData {
  id: string;
  nameFr: string;
  nameAr: string;
  coefficient: number;
  order: number;
  icon: string;
}

export default function ModuleForm({
  mode,
  yearId,
  module,
  onDone,
}: {
  mode: "create" | "edit";
  yearId?: number;
  module?: ModuleFormData;
  onDone?: () => void;
}) {
  const t = useTranslations("admin.content");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = z.object({
    nameFr: z.string().min(1, t("errorRequired")),
    nameAr: z.string().min(1, t("errorRequired")),
    coefficient: z.coerce.number().int().min(0).max(20),
    order: z.coerce.number().int().min(0).max(99),
    icon: z.string().min(1),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameFr: module?.nameFr ?? "",
      nameAr: module?.nameAr ?? "",
      coefficient: module?.coefficient ?? 1,
      order: module?.order ?? 0,
      icon: module?.icon ?? "pill",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result =
      mode === "create"
        ? await createModule({ yearId: yearId!, ...values })
        : await updateModule(module!.id, values);
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
          <Label htmlFor={`${mode}-mfr-${module?.id ?? yearId}`}>
            {t("nameFr")}
          </Label>
          <Input
            id={`${mode}-mfr-${module?.id ?? yearId}`}
            {...register("nameFr")}
          />
          {errors.nameFr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${mode}-mar-${module?.id ?? yearId}`}>
            {t("nameAr")}
          </Label>
          <Input
            id={`${mode}-mar-${module?.id ?? yearId}`}
            dir="rtl"
            {...register("nameAr")}
          />
          {errors.nameAr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>{t("coefficient")}</Label>
          <Input type="number" min={0} max={20} {...register("coefficient")} />
          {errors.coefficient && (
            <p className="text-error text-sm">{t("errorNumber")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>{t("order")}</Label>
          <Input type="number" min={0} max={99} {...register("order")} />
          {errors.order && (
            <p className="text-error text-sm">{t("errorNumber")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>{t("icon")}</Label>
          <Input {...register("icon")} />
          {errors.icon && (
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
        {isSubmitting ? t("saving") : mode === "create" ? t("addModule") : t("save")}
      </Button>
    </form>
  );
}
