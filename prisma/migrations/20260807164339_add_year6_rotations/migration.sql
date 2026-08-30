-- CreateTable
CREATE TABLE "rotations" (
    "id" TEXT NOT NULL,
    "yearId" INTEGER NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "disciplinesFr" TEXT NOT NULL,
    "disciplinesAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'stethoscope',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rotations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rotations_yearId_idx" ON "rotations"("yearId");

-- AddForeignKey
ALTER TABLE "rotations" ADD CONSTRAINT "rotations_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
