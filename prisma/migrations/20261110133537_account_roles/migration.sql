-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- Existing course owners were teachers before explicit roles were introduced.
UPDATE "User" SET "role" = 'TEACHER'
WHERE EXISTS (SELECT 1 FROM "Course" WHERE "Course"."teacherId" = "User"."id");
