"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-margin-mobile text-center">
      <h1 className="font-[var(--font-manrope)] text-headline-lg text-primary">
        {t("errorTitle")}
      </h1>
      <p className="font-[var(--font-inter)] text-body-md text-on-surface-variant max-w-md">
        {t("errorDescription")}
      </p>
      <Button
        size="lg"
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary-container px-6 rounded-lg shadow-sm"
      >
        {t("tryAgain")}
      </Button>
    </div>
  );
}
