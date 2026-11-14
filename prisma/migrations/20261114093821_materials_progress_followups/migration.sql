-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('OPEN', 'DONE');

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "sourceId" TEXT;

-- CreateTable
CREATE TABLE "MaterialCompletion" (
    "materialId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialCompletion_pkey" PRIMARY KEY ("materialId","studentId")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "status" "FollowUpStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MaterialCompletion_studentId_idx" ON "MaterialCompletion"("studentId");

-- CreateIndex
CREATE INDEX "FollowUp_courseId_studentId_createdAt_idx" ON "FollowUp"("courseId", "studentId", "createdAt");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialCompletion" ADD CONSTRAINT "MaterialCompletion_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialCompletion" ADD CONSTRAINT "MaterialCompletion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
