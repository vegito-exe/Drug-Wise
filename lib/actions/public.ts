"use server";

import { getSignedDownloadUrl } from "@/lib/r2";

export async function getContentDownloadUrl(
  fileKey: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!fileKey) return { ok: false, error: "No file key provided" };
  try {
    const url = await getSignedDownloadUrl({ key: fileKey });
    return { ok: true, url };
  } catch {
    return { ok: false, error: "Failed to generate download URL" };
  }
}
