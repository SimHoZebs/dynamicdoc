-- CreateTable
CREATE TABLE "Doc" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "blockOrder" TEXT[],

    CONSTRAINT "Doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentBlock" (
    "docId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ParentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildBlock" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "text" TEXT,
    "type" TEXT,
    "special" TEXT,
    "prevChildId" TEXT,

    CONSTRAINT "ChildBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParentBlock" ADD CONSTRAINT "ParentBlock_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildBlock" ADD CONSTRAINT "ChildBlock_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildBlock" ADD CONSTRAINT "ChildBlock_prevChildId_fkey" FOREIGN KEY ("prevChildId") REFERENCES "ChildBlock"("id") ON DELETE SET NULL ON UPDATE CASCADE;
