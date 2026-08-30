"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteButton({
  confirmLabel,
  onDelete,
}: {
  confirmLabel: string;
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const t = useTranslations("admin.common");
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await onDelete();
    if (!result.ok) {
      setError(result.error ?? t("errorGeneric"));
      setBusy(false);
      setConfirming(false);
      return;
    }
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={run}
        disabled={busy}
        className={`gap-1.5 ${
          confirming
            ? "bg-error text-white border-error hover:bg-error/90"
            : "text-error border-error/40 hover:bg-error/5"
        }`}
      >
        <Trash2 className="w-4 h-4" />
        {busy
          ? t("deleting")
          : confirming
            ? confirmLabel
            : t("delete")}
      </Button>
      {error && (
        <span className="text-error text-xs" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
