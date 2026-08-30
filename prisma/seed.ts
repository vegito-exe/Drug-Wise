import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import {
  years as mockYears,
  modules as mockModules,
  mockFaqEntries,
  year6Rotations,
} from "../lib/seed-data";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

async function main() {
  // ── Years (PRD Appendix A) ──
  for (const y of mockYears) {
    await prisma.year.upsert({
      where: { number: y.number },
      update: {
        labelFr: y.labelFr,
        labelAr: y.labelAr,
        totalCoefficient: y.totalCoefficient,
      },
      create: {
        number: y.number,
        labelFr: y.labelFr,
        labelAr: y.labelAr,
        totalCoefficient: y.totalCoefficient,
      },
    });
  }
  console.log(`Seeded ${mockYears.length} years`);

  // ── Modules (PRD Appendix A, bilingual) ──
  for (const m of mockModules) {
    await prisma.module.upsert({
      where: { id: m.id },
      update: {
        yearId: m.yearId,
        nameFr: m.nameFr,
        nameAr: m.nameAr,
        icon: m.icon,
        coefficient: m.coefficient,
        order: m.order,
      },
      create: {
        id: m.id,
        yearId: m.yearId,
        nameFr: m.nameFr,
        nameAr: m.nameAr,
        icon: m.icon,
        coefficient: m.coefficient,
        order: m.order,
      },
    });
  }
  console.log(`Seeded ${mockModules.length} modules`);

  // ── Year 6 internship rotations (PRD §8) ──
  for (const r of year6Rotations) {
    await prisma.rotation.upsert({
      where: { id: r.id },
      update: {
        nameFr: r.nameFr,
        nameAr: r.nameAr,
        disciplinesFr: r.disciplinesFr,
        disciplinesAr: r.disciplinesAr,
        icon: r.icon,
        order: year6Rotations.indexOf(r) + 1,
      },
      create: {
        id: r.id,
        yearId: 6,
        nameFr: r.nameFr,
        nameAr: r.nameAr,
        disciplinesFr: r.disciplinesFr,
        disciplinesAr: r.disciplinesAr,
        icon: r.icon,
        order: year6Rotations.indexOf(r) + 1,
      },
    });
  }
  console.log(`Seeded ${year6Rotations.length} year-6 rotations`);

  // ── FAQ entries (bilingual) ──
  for (const f of mockFaqEntries) {
    await prisma.fAQEntry.upsert({
      where: { id: f.id },
      update: {
        questionFr: f.questionFr,
        questionAr: f.questionAr,
        answerFr: f.answerFr,
        answerAr: f.answerAr,
      },
      create: {
        id: f.id,
        questionFr: f.questionFr,
        questionAr: f.questionAr,
        answerFr: f.answerFr,
        answerAr: f.answerAr,
      },
    });
  }
  console.log(`Seeded ${mockFaqEntries.length} FAQ entries`);

  // ── Admin + demo student ──
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "pharma.sabrinna@gmail.com";
  const adminPassword = await hashPassword(
    process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe-12345"
  );
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", emailVerified: true },
    create: {
      email: adminEmail,
      name: "DrugWise Admin",
      role: "ADMIN",
      emailVerified: true,
    },
  });
  // Better Auth stores email/password credentials in the Account table.
  await prisma.account.upsert({
    where: { id: `credential-${admin.id}` },
    update: { password: adminPassword },
    create: {
      id: `credential-${admin.id}`,
      userId: admin.id,
      accountId: admin.id,
      providerId: "credential",
      password: adminPassword,
    },
  });
  console.log(`Admin ready: ${adminEmail}`);

  const studentEmail = "etudiant@example.com";
  const studentPassword = await hashPassword("Etudiant-1234");
  const student = await prisma.user.upsert({
    where: { email: studentEmail },
    update: {},
    create: {
      email: studentEmail,
      name: "Étudiant Test",
      role: "STUDENT",
      emailVerified: true,
    },
  });
  await prisma.account.upsert({
    where: { id: `credential-${student.id}` },
    update: { password: studentPassword },
    create: {
      id: `credential-${student.id}`,
      userId: student.id,
      accountId: student.id,
      providerId: "credential",
      password: studentPassword,
    },
  });
  console.log(`Student ready: ${studentEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
