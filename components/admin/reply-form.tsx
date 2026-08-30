"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { replyToQuestion } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReplyForm({
  questionId,
  onDone,
}: {
  questionId: string;
  onDone?: () => void;
}) {
  const t = useTranslations("admin.questions");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = z.object({
    answerText: z.string().min(1, t("errorEmptyAnswer")),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { answerText: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await replyToQuestion({
      questionId,
      answerText: values.answerText,
    });
    if (!result.ok) {
      setServerError(
        result.error === "Already answered" ? t("errorAlreadyAnswered") : t("errorGeneric")
      );
      return;
    }
    reset();
    onDone?.();
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <label
        htmlFor={`reply-${questionId}`}
        className="block font-[var(--font-ibm-plex)] text-label-sm text-on-surface-variant"
      >
        {t("yourReply")}
      </label>
      <Textarea
        id={`reply-${questionId}`}
        className="bg-surface-neutral text-body-sm text-on-surface resize-none min-h-[96px]"
        placeholder={t("replyPlaceholder")}
        rows={4}
        {...register("answerText")}
      />
      {errors.answerText && (
        <p className="text-error text-sm">{t("errorEmptyAnswer")}</p>
      )}
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
        <Send className="w-4 h-4" />
        {isSubmitting ? t("sending") : t("sendReply")}
      </Button>
    </form>
  );
}
