/*
  Warnings:

  - You are about to drop the column `prevChildId` on the `ChildBlock` table. All the data in the column will be lost.
  - You are about to drop the column `special` on the `ChildBlock` table. All the data in the column will be lost.
  - You are about to drop the `LexicalChildBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LexicalParentBlock` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `detail` to the `ChildBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `ChildBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `ChildBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `ChildBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `ChildBlock` table without a default value. This is not possible if the table is not empty.
  - Made the column `parentId` on table `ChildBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `ChildBlock` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `ChildBlock` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `direction` to the `ParentBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `ParentBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `ParentBlock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChildBlock" DROP CONSTRAINT "ChildBlock_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ChildBlock" DROP CONSTRAINT "ChildBlock_prevChildId_fkey";

-- DropForeignKey
ALTER TABLE "LexicalChildBlock" DROP CONSTRAINT "LexicalChildBlock_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ParentBlock" DROP CONSTRAINT "ParentBlock_docId_fkey";

-- AlterTable
ALTER TABLE "ChildBlock" DROP COLUMN "prevChildId",
DROP COLUMN "special",
ADD COLUMN     "detail" INTEGER NOT NULL,
ADD COLUMN     "format" INTEGER NOT NULL,
ADD COLUMN     "mode" TEXT NOT NULL,
ADD COLUMN     "style" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL,
ALTER COLUMN "parentId" SET NOT NULL,
ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "ParentBlock" ADD COLUMN     "direction" "Direction" NOT NULL,
ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "indent" INTEGER,
ADD COLUMN     "version" INTEGER NOT NULL,
ALTER COLUMN "docId" DROP NOT NULL;

-- DropTable
DROP TABLE "LexicalChildBlock";

-- DropTable
DROP TABLE "LexicalParentBlock";

-- AddForeignKey
ALTER TABLE "ParentBlock" ADD CONSTRAINT "ParentBlock_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildBlock" ADD CONSTRAINT "ChildBlock_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
