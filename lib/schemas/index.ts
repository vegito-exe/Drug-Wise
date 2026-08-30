import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const questionSchema = z.object({
  moduleId: z.string().optional(),
  questionText: z
    .string()
    .min(10, "Votre question doit contenir au moins 10 caractères")
    .max(2000, "Votre question est trop longue (2000 caractères max)"),
});

export const replySchema = z.object({
  questionId: z.string().min(1),
  answerText: z
    .string()
    .min(1, "La réponse ne peut pas être vide")
    .max(10000, "La réponse est trop longue (10000 caractères max)"),
});

export const faqEntrySchema = z.object({
  questionFr: z.string().min(1, "Question (FR) requise").max(1000),
  questionAr: z.string().min(1, "Question (AR) requise").max(1000),
  answerFr: z.string().min(1, "Réponse (FR) requise").max(10000),
  answerAr: z.string().min(1, "Réponse (AR) requise").max(10000),
  category: z.enum(["CLINICAL_PRACTICE", "PHARMACOLOGY", "CALCULATIONS", "PLATFORM_SUPPORT"]).optional(),
});

export const yearSchema = z.object({
  number: z.number().int().min(1).max(6),
  labelFr: z.string().min(1, "Label (FR) requis").max(100),
  labelAr: z.string().min(1, "Label (AR) requis").max(100),
  totalCoefficient: z.number().int().min(0).max(100).default(0),
});

export const moduleSchema = z.object({
  yearId: z.number().int().positive(),
  nameFr: z.string().min(1, "Nom (FR) requis").max(200),
  nameAr: z.string().min(1, "Nom (AR) requis").max(200),
  coefficient: z.number().int().min(0).max(20).default(1),
  order: z.number().int().min(0).max(99).default(0),
  icon: z.string().min(1).max(50).default("pill"),
});

export const contentItemSchema = z.object({
  moduleId: z.string().min(1),
  type: z.enum(["summary", "quiz"]),
  titleFr: z.string().min(1, "Titre (FR) requis").max(300),
  titleAr: z.string().min(1, "Titre (AR) requis").max(300),
  description: z.string().max(2000).optional().or(z.literal("")),
  fileName: z.string().max(255).optional(),
  fileUrl: z
    .string()
    .max(2048)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^https?:\/\//i.test(v), { message: "Lien invalide (http/https requis)" }),
  fileKey: z.string().max(1024).optional(),
  fileSize: z.number().int().min(0).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type ReplyInput = z.infer<typeof replySchema>;
export type FAQEntryInput = z.infer<typeof faqEntrySchema>;
export type YearInput = z.infer<typeof yearSchema>;
export type ModuleInput = z.infer<typeof moduleSchema>;
export type ContentItemInput = z.infer<typeof contentItemSchema>;
