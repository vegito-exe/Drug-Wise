"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Pencil, X } from "lucide-react";
import { deleteFaqEntry } from "@/lib/actions/admin";
import DeleteButton from "@/components/admin/delete-button";
import FAQForm, { type FAQFormEntry } from "@/components/admin/faq-form";
import { Button } from "@/components/ui/button";

export default function FAQEntryCard({ entry }: { entry: FAQFormEntry }) {
  const t = useTranslations("admin.faq");
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const onDelete = async () => {
    const result = await deleteFaqEntry(entry.id);
    if (!result.ok) return result;
    router.refresh();
    return { ok: true };
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-surface-container-high p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[var(--font-manrope)] text-headline-sm text-on-surface font-semibold">
            {t("editEntry")}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
            className="text-on-surface-variant"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <FAQForm
          mode="edit"
          entry={entry}
          onDone={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-container-high p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="font-[var(--font-ibm-plex)] text-label-md text-primary font-semibold">
            {entry.questionFr || "—"}
          </p>
          <p className="font-[var(--font-ibm-plex)] text-label-md text-primary font-semibold" dir="rtl">
            {entry.questionAr || "—"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="gap-1.5 text-on-surface-variant"
          >
            <Pencil className="w-4 h-4" /> {t("edit")}
          </Button>
          <DeleteButton confirmLabel={t("confirmDelete")} onDelete={onDelete} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-neutral rounded-lg p-3">
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface whitespace-pre-wrap">
            {entry.answerFr || "—"}
          </p>
        </div>
        <div className="bg-surface-neutral rounded-lg p-3" dir="rtl">
          <p className="font-[var(--font-inter)] text-body-sm text-on-surface whitespace-pre-wrap">
            {entry.answerAr || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
