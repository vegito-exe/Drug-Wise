-- AlterTable
ALTER TABLE "content_items" ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "fileKey" DROP NOT NULL;
