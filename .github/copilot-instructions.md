# Engineering Guidelines

**Purpose:** this file accompanies `pharmacy-platform-prd.md` and gives stack-specific conventions and best practices for building the platform. The PRD defines *what* to build; this file defines *how* to build it correctly with this specific stack. Read both before implementing any feature.

> If you're using Claude Code specifically: consider naming a copy of this `CLAUDE.md` in the project root — Claude Code reads that file automatically as persistent project context on every session.

---

## 1. Stack Recap

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL via Neon |
| Auth | Better Auth |
| File storage | Cloudflare R2 |
| Email | Resend + React Email |
| Styling | Tailwind CSS + shadcn/ui |
| i18n | next-intl (Arabic + French, RTL/LTR) |
| Forms/validation | react-hook-form + Zod |
| Hosting | Vercel |

---

## 2. Environment Variables

```
# Database (Neon)
DATABASE_URL=          # pooled connection — must include "-pooler" in hostname
DIRECT_URL=             # unpooled connection — used only for migrations

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=

# Resend
RESEND_API_KEY=
```

Set these separately for Preview and Production in Vercel's dashboard. Never reuse production R2/Resend/DB credentials in a preview deployment.

---

## 3. Suggested Folder Structure (App Router)

```
app/
  [locale]/
    (public)/              # guest-accessible: browsing, FAQ, channel link
      page.tsx
      years/[yearId]/modules/[moduleId]/
      faq/
    (auth)/
      login/
      signup/
    (student)/              # requires session
      ask/
      my-questions/
    (admin)/                # requires session + role=ADMIN
      dashboard/
      content/
      questions/
      faq/
lib/
  auth.ts                   # Better Auth config
  prisma.ts                 # Prisma client singleton
  schemas/                  # shared Zod schemas
  r2.ts                     # R2 client + presigned URL helpers
emails/                     # React Email templates
messages/
  ar.json
  fr.json
prisma/
  schema.prisma
  seed.ts                   # seeds the Year → Module taxonomy from the PRD
```

Route groups `(public)`, `(auth)`, `(student)`, `(admin)` map directly to the role table in PRD Section 5 — keep that mapping explicit rather than checking roles ad hoc inside individual pages.

---

## 4. Next.js & Server Actions

- Default to Server Components. Add `'use client'` only where you need interactivity (forms, the ask-a-question box, admin content editor).
- All mutations (ask a question, admin CRUD, reply to a question, promote to FAQ) go through **Server Actions** — not a separate REST/tRPC API layer. App Router's Server Actions already give type-safe client→server calls; adding tRPC on top would be redundant complexity at this project's scale.
- **Do not rely on middleware alone for route protection.** A disclosed Next.js vulnerability (CVE-2025-29927) showed that middleware-only session checks could be bypassed by spoofing a request header. Treat middleware as a UX convenience (redirect unauthenticated users early) and always re-check `session.user.role` inside the Server Action or Server Component itself before doing anything sensitive — that's the real security boundary.
- Add `loading.tsx` and `error.tsx` per route segment. Assume some users are on slower mobile connections.

---

## 5. TypeScript

- `strict` mode on.
- Use Prisma-generated types directly (`import type { User, Module } from '@prisma/client'`) instead of redefining shapes by hand.
- Avoid `any`. If a type is genuinely unknown, use `unknown` and narrow it.

---

## 6. Database: Prisma + Neon

**Schema datasource block:**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled — app queries
  directUrl = env("DIRECT_URL")     // unpooled — migrations only
}
```

- `DATABASE_URL` **must** include `-pooler` in the Neon hostname; `DIRECT_URL` must **not**. Mixing these up is the single most common Prisma+Neon bug — it produces "prepared statement already exists" errors or migration failures. The pooled connection is for normal app traffic (serverless functions opening many short-lived connections); the direct one is only for `prisma migrate` commands.
- Run `prisma migrate deploy` in production, `prisma migrate dev` locally.
- **Seed, don't hardcode:** load the Year → Module taxonomy (PRD Appendix A) via `prisma/seed.ts` (`npx prisma db seed`), not as constants baked into application code — the PRD already establishes that Sabrine needs to add/edit/remove content freely, so treat the taxonomy as data from day one, not fixture code.
- **Cold starts are expected, not bugs:** Neon scales compute to zero after ~5 minutes idle; the first query after that can take a few hundred milliseconds to a couple seconds while it wakes up. Don't "fix" this — it's normal serverless Postgres behavior.
- **Use Neon's branch-per-PR:** each pull request can get its own isolated database branch, pairing naturally with Vercel's preview deployments — schema changes get tested in true isolation before merging to main.

---

## 7. Auth: Better Auth

- Use the official Better Auth Prisma adapter.
- Add a `role` field to the `User` model:
```prisma
enum Role {
  STUDENT
  ADMIN
}

model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
  role  Role   @default(STUDENT)
  // ...
}
```
- Better Auth is TypeScript-first and infers custom fields like `role` into the session type automatically — you don't need the manual session-callback type overriding that older Auth.js/NextAuth setups required.
- Built-in email/password signup and password-reset flow — don't hand-roll bcrypt hashing or reset-token logic; Better Auth handles this internally.
- Protect admin functionality by checking `session.user.role === "ADMIN"` at the start of the relevant Server Action or Server Component — see the middleware caveat in Section 4.

---

## 8. File Storage: Cloudflare R2

- **Never proxy PDF uploads through a Next.js Server Action/Route Handler.** Use the presigned URL pattern instead:
  1. Admin's client calls a Server Action requesting an upload URL (Server Action verifies `role === "ADMIN"` first).
  2. Server Action generates a short-lived presigned URL via `@aws-sdk/client-s3` + `getSignedUrl`, pointed at R2's S3-compatible endpoint.
  3. Client uploads the file **directly to R2** using that URL (bypasses your server entirely for the actual bytes).
  4. Client notifies the server on completion; server saves the resulting file key on the `ContentItem` record.
- Validate file type (PDF only) and size limits on **both** client (fast feedback) and server (the actual enforcement — never trust client-side validation alone).
- Key naming convention: namespace by module, e.g. `summaries/{moduleId}/{uuid}-{filename}`, to avoid collisions and keep the bucket organized.
- R2 is fully S3-compatible — standard AWS SDK tooling works unmodified, just point the endpoint at your R2 account URL instead of AWS.

---

## 9. Email: Resend + React Email

- Build templates as React components under `emails/`, using `@react-email/components`.
- **Bilingual templates:** pick one approach and stay consistent — either two full template variants (AR/FR) selected by the student's saved locale preference, or a single template showing both languages stacked. Two variants is cleaner if you're tracking a locale per user anyway.
- **Never let email failure block the core action.** If sending the "Sabrine answered your question" email fails, the answer must still save and show up in "My Questions" — log the email failure separately, don't roll back the reply.

---

## 10. Styling: Tailwind CSS + shadcn/ui

- Use Tailwind's **logical properties** (`ps-4`, `pe-4`, `text-start`, `text-end`) instead of directional ones (`pl-4`, `text-left`) throughout — the UI must flip correctly between Arabic (RTL) and French (LTR), and logical properties handle that automatically.
- Set `dir` and `lang` on the root `<html>` element based on the active locale.
- shadcn/ui components are copied into your repo, not installed as an opaque dependency — customize them directly rather than wrapping them in extra abstraction layers.

---

## 11. i18n: next-intl

- One JSON message file per locale: `messages/ar.json`, `messages/fr.json`.
- Locale-prefixed routing (`/ar/...`, `/fr/...`) so guests can land directly in either language.
- **Bilingual data, not just UI strings:** module and content names need translation at the data level too — e.g. `nameAr` / `nameFr` fields on the `Module` model — since the PRD requires the academic content itself to be bilingual, not just buttons and navigation.

---

## 12. Forms & Validation: react-hook-form + Zod

- Define each form's Zod schema **once**, in `lib/schemas/`, and reuse it for both the client-side resolver and the server-side Server Action validation. Never trust client-side validation alone — always re-validate server-side.

---

## 13. Hosting: Vercel

- Separate environment variables per environment (Preview vs Production) in the Vercel dashboard.
- Pair Vercel preview deployments with Neon branch-per-PR for fully isolated preview environments — both schema and data, not just an isolated frontend build.

---

## 14. Security Checklist

- [ ] Server-side session/role checks on every Server Action and Route Handler — not just middleware (Section 4)
- [ ] File upload type and size validated server-side, not just client-side (Section 8)
- [ ] Rate-limit the "ask a question" action to prevent spam — a simple per-user per-hour cap is sufficient at this scale
- [ ] R2 credentials never exposed to the client — presigned URLs only
- [ ] Passwords never touched directly in application code — Better Auth handles hashing internally

---

## 15. Data Model Quick Reference

Full field-level detail lives in PRD Section 7 — this is just a pointer so it isn't duplicated here:

`User` · `Year` · `Module` · `ContentItem` (summary/quiz) · `Question` · `FAQEntry`
