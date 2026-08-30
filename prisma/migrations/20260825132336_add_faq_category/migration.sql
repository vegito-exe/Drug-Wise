-- CreateEnum
CREATE TYPE "FAQCategory" AS ENUM ('CLINICAL_PRACTICE', 'PHARMACOLOGY', 'CALCULATIONS', 'PLATFORM_SUPPORT');

-- AlterTable
ALTER TABLE "faq_entries" ADD COLUMN     "category" "FAQCategory";
