-- AlterTable
ALTER TABLE "partners"
  DROP COLUMN "createdAt",
  DROP COLUMN "updatedAt";

ALTER TABLE "partners"
  RENAME COLUMN "imageUrl" TO "image";
