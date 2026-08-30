"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Star } from "lucide-react";
import { promoteToFaq } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export default function PromoteToFaqButton({
  questionId,
  alreadyPromoted,
}: {
  questionId: string;
  alreadyPromoted: boolean;
}) {
  const t = useTranslations("admin.questions");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [promoted, setPromoted] = useState(alreadyPromoted);

  const onPromote = async () => {
    setServerError(null);
    const result = await promoteToFaq(questionId);
    if (!result.ok) {
      setServerError(
        result.error === "Already promoted to FAQ"
          ? t("errorAlreadyPromoted")
          : t("errorGeneric")
      );
      return;
    }
    setPromoted(true);
    router.refresh();
  };

  if (promoted) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-success bg-teal-success/10 px-2 py-1 rounded-full">
        <Star className="w-3.5 h-3.5" /> {t("promoted")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPromote}
        className="gap-1.5 text-teal-success border-teal-success/40 hover:bg-teal-success/5"
      >
        <Star className="w-4 h-4" />
        {t("promoteToFaq")}
      </Button>
      {serverError && (
        <span className="text-error text-xs" role="alert">
          {serverError}
        </span>
      )}
    </div>
  );
}
