"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { questionSchema, type QuestionInput } from "@/lib/schemas";

const HOURLY_QUESTION_LIMIT = 5;

export type AskQuestionErrorCode =
  | "notAuthenticated"
  | "rateLimit"
  | "invalidModule"
  | "generic";

export type AskQuestionResult =
  | { status: "success" }
  | { status: "error"; code: AskQuestionErrorCode };

export async function askQuestion(
  input: QuestionInput
): Promise<AskQuestionResult> {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    return { status: "error", code: "notAuthenticated" };
  }
  if (!session?.user) return { status: "error", code: "notAuthenticated" };

  const parsed = questionSchema.safeParse(input);
  if (!parsed.success) return { status: "error", code: "generic" };

  const { moduleId, questionText } = parsed.data;

  if (moduleId) {
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId },
    });
    if (!existingModule) return { status: "error", code: "invalidModule" };
  }

  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await prisma.question.count({
    where: { studentId: session.user.id, createdAt: { gte: since } },
  });
  if (recentCount >= HOURLY_QUESTION_LIMIT) {
    return { status: "error", code: "rateLimit" };
  }

  try {
    await prisma.question.create({
      data: {
        studentId: session.user.id,
        moduleId: moduleId ?? null,
        questionText,
      },
    });
  } catch {
    return { status: "error", code: "generic" };
  }

  revalidatePath("/my-questions");
  revalidatePath("/fr/my-questions");
  revalidatePath("/ar/my-questions");
  return { status: "success" };
}
