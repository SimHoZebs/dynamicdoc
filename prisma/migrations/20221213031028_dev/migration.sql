/*
  Warnings:

  - You are about to drop the column `content` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `pageId` on the `Block` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[childrenId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `docId` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_pageId_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "content",
DROP COLUMN "pageId",
ADD COLUMN     "childrenId" TEXT,
ADD COLUMN     "docId" TEXT NOT NULL,
ADD COLUMN     "special" TEXT,
ADD COLUMN     "text" TEXT,
ALTER COLUMN "type" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Block_childrenId_key" ON "Block"("childrenId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_childrenId_fkey" FOREIGN KEY ("childrenId") REFERENCES "Block"("id") ON DELETE SET NULL ON UPDATE CASCADE;
