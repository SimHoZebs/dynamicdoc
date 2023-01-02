-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('ltr', 'rtl');

-- CreateTable
CREATE TABLE "LexicalParentBlock" (
    "id" TEXT NOT NULL,
    "direction" "Direction" NOT NULL,
    "format" TEXT NOT NULL,
    "indent" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "LexicalParentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LexicalChildBlock" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "detail" INTEGER NOT NULL,
    "format" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "LexicalChildBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LexicalChildBlock" ADD CONSTRAINT "LexicalChildBlock_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LexicalParentBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
