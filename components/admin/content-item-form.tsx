"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Link2 } from "lucide-react";
import { createContentItem, updateContentItem } from "@/lib/actions/admin";
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

export interface ContentItemFormData {
  id: string;
  type: "summary" | "quiz";
  titleFr: string;
  titleAr: string;
  description: string | null;
  fileName: string;
  fileUrl: string | null;
}

export default function ContentItemForm({
  mode,
  moduleId,
  item,
  onDone,
}: {
  mode: "create" | "edit";
  moduleId?: string;
  item?: ContentItemFormData;
  onDone?: () => void;
}) {
  const t = useTranslations("admin.content");
  const locale = useLocale();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [type, setType] = useState<"summary" | "quiz">(item?.type ?? "summary");

  const schema = z.object({
    type: z.enum(["summary", "quiz"]),
    titleFr: z.string().min(1, t("errorRequired")),
    titleAr: z.string().min(1, t("errorRequired")),
    description: z.string().max(2000).optional(),
    fileName: z.string().max(255).optional(),
    fileUrl: z
      .string()
      .min(1, t("errorFileUrl"))
      .refine((v) => /^https?:\/\//i.test(v), t("errorFileUrl")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: item?.type ?? "summary",
      titleFr: item?.titleFr ?? "",
      titleAr: item?.titleAr ?? "",
      description: item?.description ?? "",
      fileName: item?.fileName ?? "",
      fileUrl: item?.fileUrl ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const payload = {
        type: values.type,
        titleFr: values.titleFr,
        titleAr: values.titleAr,
        description: values.description || undefined,
        fileName: values.fileName || undefined,
        fileUrl: values.fileUrl,
      };
      const result =
        mode === "create"
          ? await createContentItem({ moduleId: moduleId!, ...payload })
          : await updateContentItem(item!.id, payload);
      if (result && !result.ok) {
        setServerError(t("errorGeneric"));
        return;
      }
      onDone?.();
      router.refresh();
    } catch {
      setServerError(t("errorGeneric"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{t("type")}</Label>
          <Select value={type} onValueChange={(v) => {
            setType(v as "summary" | "quiz");
            setValue("type", v as "summary" | "quiz");
          }}>
            <SelectTrigger className="bg-surface-neutral text-body-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">
                {locale === "ar" ? t("typeSummaryAr") : t("typeSummary")}
              </SelectItem>
              <SelectItem value="quiz">
                {locale === "ar" ? t("typeQuizAr") : t("typeQuiz")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>{t("fileName")}</Label>
          <Input {...register("fileName")} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>{t("fileUrl")} *</Label>
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-on-surface-variant shrink-0" />
          <Input
            dir="ltr"
            type="url"
            placeholder="https://..."
            {...register("fileUrl")}
          />
        </div>
        {errors.fileUrl && (
          <p className="text-error text-sm">{t("errorFileUrl")}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{t("titleFr")}</Label>
          <Input {...register("titleFr")} />
          {errors.titleFr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>{t("titleAr")}</Label>
          <Input dir="rtl" {...register("titleAr")} />
          {errors.titleAr && (
            <p className="text-error text-sm">{t("errorRequired")}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <Label>{t("description")}</Label>
        <Textarea rows={2} {...register("description")} />
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
        {isSubmitting ? t("saving") : mode === "create" ? t("addContent") : t("save")}
      </Button>
    </form>
  );
}
