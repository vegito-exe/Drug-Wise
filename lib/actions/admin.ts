"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendQuestionAnsweredEmail } from "@/lib/email";
import {
  contentItemSchema,
  faqEntrySchema,
  moduleSchema,
  replySchema,
  yearSchema,
} from "@/lib/schemas";
import { deleteFile } from "@/lib/r2";

export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAdmin(): Promise<boolean> {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    return false;
  }
  return session?.user?.role === "ADMIN";
}

function revalidateAll(paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

// ── Question inbox ─────────────────────────────────────────────────────

export async function replyToQuestion(
  input: { questionId: string; answerText: string }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const { questionId, answerText } = parsed.data;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { student: true },
  });
  if (!question) return { ok: false, error: "Question not found" };
  if (question.status === "answered") {
    return { ok: false, error: "Already answered" };
  }

  await prisma.question.update({
    where: { id: questionId },
    data: {
      answerText,
      status: "answered",
      answeredAt: new Date(),
    },
  });

  try {
    await sendQuestionAnsweredEmail({
      to: question.student.email,
      studentName: question.student.name,
      questionText: question.questionText,
      answerText,
    });
  } catch (err) {
    console.error("Question-answered email failed (answer still saved):", err);
  }

  revalidateAll([
    "/fr/my-questions",
    "/ar/my-questions",
    "/fr/admin/questions",
    "/ar/admin/questions",
  ]);
  return { ok: true };
}

export async function promoteToFaq(
  questionId: string
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return { ok: false, error: "Question not found" };
  if (question.status !== "answered" || !question.answerText) {
    return { ok: false, error: "Only answered questions can be promoted" };
  }

  const isArabic = containsArabic(question.questionText);

  try {
    await prisma.fAQEntry.create({
      data: {
        questionFr: isArabic ? "(Voir la version française)" : question.questionText,
        questionAr: isArabic ? question.questionText : "(انظر النسخة العربية)",
        answerFr: isArabic ? "(Voir la version française)" : question.answerText,
        answerAr: isArabic ? question.answerText : "(انظر النسخة العربية)",
        sourceQuestionId: question.id,
      },
    });
  } catch {
    return { ok: false, error: "Already promoted to FAQ" };
  }

  revalidateAll([
    "/fr/faq",
    "/ar/faq",
    "/fr/admin/faq",
    "/ar/admin/faq",
    "/fr/admin/questions",
    "/ar/admin/questions",
  ]);
  return { ok: true };
}

// ── FAQ management ─────────────────────────────────────────────────────

export async function createFaqEntry(
  input: {
    questionFr: string;
    questionAr: string;
    answerFr: string;
    answerAr: string;
    category?: string;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = faqEntrySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  await prisma.fAQEntry.create({
    data: {
      questionFr: parsed.data.questionFr,
      questionAr: parsed.data.questionAr,
      answerFr: parsed.data.answerFr,
      answerAr: parsed.data.answerAr,
      category: parsed.data.category as "CLINICAL_PRACTICE" | "PHARMACOLOGY" | "CALCULATIONS" | "PLATFORM_SUPPORT" ?? null,
    },
  });

  revalidateAll(["/fr/faq", "/ar/faq", "/fr/admin/faq", "/ar/admin/faq"]);
  return { ok: true };
}

export async function updateFaqEntry(
  id: string,
  input: {
    questionFr: string;
    questionAr: string;
    answerFr: string;
    answerAr: string;
    category?: string;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = faqEntrySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  await prisma.fAQEntry.update({
    where: { id },
    data: {
      questionFr: parsed.data.questionFr,
      questionAr: parsed.data.questionAr,
      answerFr: parsed.data.answerFr,
      answerAr: parsed.data.answerAr,
      category: parsed.data.category as "CLINICAL_PRACTICE" | "PHARMACOLOGY" | "CALCULATIONS" | "PLATFORM_SUPPORT" ?? null,
    },
  });

  revalidateAll(["/fr/faq", "/ar/faq", "/fr/admin/faq", "/ar/admin/faq"]);
  return { ok: true };
}

export async function deleteFaqEntry(
  id: string
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  await prisma.fAQEntry.delete({ where: { id } });

  revalidateAll(["/fr/faq", "/ar/faq", "/fr/admin/faq", "/ar/admin/faq"]);
  return { ok: true };
}

// ── Content management ─────────────────────────────────────────────────

export async function createYear(
  input: {
    number: number;
    labelFr: string;
    labelAr: string;
    totalCoefficient?: number;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = yearSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  try {
    await prisma.year.create({
      data: {
        number: parsed.data.number,
        labelFr: parsed.data.labelFr,
        labelAr: parsed.data.labelAr,
        totalCoefficient: parsed.data.totalCoefficient,
      },
    });
  } catch {
    return { ok: false, error: "A year with this number already exists" };
  }

  revalidateAll(["/fr", "/ar", "/fr/admin/content", "/ar/admin/content"]);
  return { ok: true };
}

export async function updateYear(
  id: number,
  input: { labelFr: string; labelAr: string; totalCoefficient?: number }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = yearSchema
    .pick({ labelFr: true, labelAr: true, totalCoefficient: true })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  await prisma.year.update({
    where: { id },
    data: parsed.data,
  });

  revalidateAll(["/fr", "/ar", "/fr/admin/content", "/ar/admin/content"]);
  return { ok: true };
}

export async function deleteYear(id: number): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const year = await prisma.year.findUnique({
    where: { id },
    include: { _count: { select: { modules: true } } },
  });
  if (!year) return { ok: false, error: "Year not found" };
  if (year._count.modules > 0) {
    return { ok: false, error: "Delete its modules first" };
  }

  await prisma.year.delete({ where: { id } });

  revalidateAll(["/fr", "/ar", "/fr/admin/content", "/ar/admin/content"]);
  return { ok: true };
}

export async function createModule(
  input: {
    yearId: number;
    nameFr: string;
    nameAr: string;
    coefficient?: number;
    order?: number;
    icon?: string;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = moduleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const year = await prisma.year.findUnique({
    where: { id: parsed.data.yearId },
  });
  if (!year) return { ok: false, error: "Year not found" };

  await prisma.module.create({
    data: {
      yearId: parsed.data.yearId,
      nameFr: parsed.data.nameFr,
      nameAr: parsed.data.nameAr,
      coefficient: parsed.data.coefficient,
      order: parsed.data.order,
      icon: parsed.data.icon,
    },
  });

  revalidateAll([
    "/fr",
    "/ar",
    `/fr/years/${parsed.data.yearId}`,
    `/ar/years/${parsed.data.yearId}`,
    "/fr/admin/content",
    "/ar/admin/content",
  ]);
  return { ok: true };
}

export async function updateModule(
  id: string,
  input: {
    nameFr: string;
    nameAr: string;
    coefficient?: number;
    order?: number;
    icon?: string;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const moduleRecord = await prisma.module.findUnique({ where: { id } });
  if (!moduleRecord) return { ok: false, error: "Module not found" };

  const parsed = moduleSchema
    .pick({ nameFr: true, nameAr: true, coefficient: true, order: true, icon: true })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  await prisma.module.update({
    where: { id },
    data: parsed.data,
  });

  revalidateAll([
    "/fr",
    "/ar",
    `/fr/years/${moduleRecord.yearId}`,
    `/ar/years/${moduleRecord.yearId}`,
    "/fr/admin/content",
    "/ar/admin/content",
  ]);
  return { ok: true };
}

export async function deleteModule(id: string): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const moduleRecord = await prisma.module.findUnique({ where: { id } });
  if (!moduleRecord) return { ok: false, error: "Module not found" };

  await prisma.module.delete({ where: { id } });

  revalidateAll([
    "/fr",
    "/ar",
    `/fr/years/${moduleRecord.yearId}`,
    `/ar/years/${moduleRecord.yearId}`,
    "/fr/admin/content",
    "/ar/admin/content",
  ]);
  return { ok: true };
}

export async function createContentItem(
  input: {
    moduleId: string;
    type: "summary" | "quiz";
    titleFr: string;
    titleAr: string;
    description?: string;
    fileName?: string;
    fileUrl?: string;
    fileKey?: string;
    fileSize?: number;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const parsed = contentItemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const moduleRecord = await prisma.module.findUnique({
    where: { id: parsed.data.moduleId },
  });
  if (!moduleRecord) return { ok: false, error: "Module not found" };

  await prisma.contentItem.create({
    data: {
      moduleId: parsed.data.moduleId,
      type: parsed.data.type,
      titleFr: parsed.data.titleFr,
      titleAr: parsed.data.titleAr,
      description: parsed.data.description || null,
      fileUrl: parsed.data.fileUrl || null,
      fileKey: parsed.data.fileKey || null,
      fileName: parsed.data.fileName ?? "",
      fileSize: parsed.data.fileSize ?? 0,
    },
  });

  revalidateAll([
    "/fr",
    "/ar",
    `/fr/years/${moduleRecord.yearId}`,
    `/ar/years/${moduleRecord.yearId}`,
    "/fr/admin/content",
    "/ar/admin/content",
  ]);
  return { ok: true };
}

export async function updateContentItem(
  id: string,
  input: {
    type: "summary" | "quiz";
    titleFr: string;
    titleAr: string;
    description?: string;
    fileName?: string;
    fileUrl?: string;
    fileKey?: string;
    fileSize?: number;
  }
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) return { ok: false, error: "Content item not found" };

  const parsed = contentItemSchema
    .pick({ type: true, titleFr: true, titleAr: true, description: true, fileName: true, fileUrl: true, fileKey: true, fileSize: true })
    .safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  // delete old storage file only when the legacy file key is replaced
  if (item.fileKey && parsed.data.fileKey && parsed.data.fileKey !== item.fileKey) {
    await deleteFile(item.fileKey);
  }

  await prisma.contentItem.update({
    where: { id },
    data: {
      type: parsed.data.type,
      titleFr: parsed.data.titleFr,
      titleAr: parsed.data.titleAr,
      description: parsed.data.description || null,
      ...(parsed.data.fileName !== undefined ? { fileName: parsed.data.fileName } : {}),
      ...(parsed.data.fileUrl !== undefined ? { fileUrl: parsed.data.fileUrl || null } : {}),
      ...(parsed.data.fileKey ? { fileKey: parsed.data.fileKey } : {}),
      ...(typeof parsed.data.fileSize === "number" ? { fileSize: parsed.data.fileSize } : {}),
    },
  });

  const moduleRecord = await prisma.module.findUnique({
    where: { id: item.moduleId },
  });

  revalidateAll([
    "/fr",
    "/ar",
    ...(moduleRecord ? [`/fr/years/${moduleRecord.yearId}`, `/ar/years/${moduleRecord.yearId}`] : []),
    "/fr/admin/content",
    "/ar/admin/content",
  ]);
  return { ok: true };
}

export async function deleteContentItem(
  id: string
): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };

  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) return { ok: false, error: "Content item not found" };

  // delete file from storage
  if (item.fileKey) await deleteFile(item.fileKey);

  await prisma.contentItem.delete({ where: { id } });

  const moduleRecord = await prisma.module.findUnique({
    where: { id: item.moduleId },
  });

  revalidateAll([
    "/fr",
    "/ar",
    ...(moduleRecord ? [`/fr/years/${moduleRecord.yearId}`, `/ar/years/${moduleRecord.yearId}`] : []),
    "/fr/admin/content",
    "/ar/admin/content",
  ]);
  return { ok: true };
}

export async function deletePlaceholderContentItems(): Promise<AdminActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Unauthorized" };
  await prisma.contentItem.deleteMany({
    where: { fileKey: { contains: "placeholder" } },
  });
  revalidateAll(["/fr", "/ar", "/fr/admin/content", "/ar/admin/content"]);
  return { ok: true };
}
