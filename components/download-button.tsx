"use client";

import { useTransition, useState } from "react";
import { Download, AlertCircle } from "lucide-react";
import { getContentDownloadUrl } from "@/lib/actions/public";
import { Button } from "@/components/ui/button";

export default function DownloadButton({
  fileUrl,
  fileKey,
  title,
  variant = "ghost",
  className,
  children,
}: {
  fileUrl?: string | null;
  fileKey?: string | null;
  title?: string;
  variant?: "ghost" | "link";
  className?: string;
  children?: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const icon = children ?? <Download className="w-5 h-5" />;

  if (fileUrl) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Button
          asChild
          variant={variant}
          size={variant === "link" ? "sm" : "icon"}
          className={className}
        >
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" title={title}>
            {icon}
          </a>
        </Button>
      </div>
    );
  }

  const handleDownload = () => {
    if (!fileKey) {
      setError("Unavailable");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await getContentDownloadUrl(fileKey);
      if (result.ok) {
        const newWindow = window.open(result.url, "_blank");
        if (!newWindow) {
          try {
            const res = await fetch(result.url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = title ?? "download";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          } catch {
            // silent
          }
        }
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant={variant}
        size={variant === "link" ? "sm" : "icon"}
        className={className}
        disabled={pending}
        onClick={handleDownload}
        title={title}
      >
        {icon}
      </Button>
      {error && (
        <span className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
  );
}