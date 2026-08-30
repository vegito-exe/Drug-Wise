import { createClient, SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
export const ALLOWED_CONTENT_TYPES = ["application/pdf"] as const;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET ?? "pharma-files";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  _client = createClient(supabaseUrl, supabaseServiceKey);
  return _client;
}

export function generateFileKey(moduleId: string, filename: string) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, "-").slice(0, 240);
  const id = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex");
  return `summaries/${moduleId}/${id}-${safeFilename}`;
}

export async function getSignedUploadUrl({
  key,
}: {
  key: string;
}): Promise<{ url: string; token: string; key: string }> {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(key, { upsert: false });
  if (error) throw new Error(error.message);
  return { url: data.signedUrl, token: data.token, key };
}

export async function uploadToSignedUrl({
  key,
  token,
  file,
}: {
  key: string;
  token: string;
  file: File | Blob | ArrayBuffer;
}): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(key, token, file);
  if (error) throw new Error(error.message);
}

export async function getSignedDownloadUrl({
  key,
  expiresIn = 3600,
}: {
  key: string;
  expiresIn?: number;
}): Promise<string> {
  const supabase = getClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, expiresIn);
  if (error) {
    throw new Error(
      error.message.includes("not found")
        ? "File not found on server"
        : "Storage service unavailable"
    );
  }
  return data.signedUrl;
}

export async function deleteFile(key: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) console.warn(`storage: failed to delete ${key}:`, error.message);
}
