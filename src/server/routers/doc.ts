import { procedure, router } from "../trpc";
import { z } from "zod";
import db from "../../lib/util/db";
import { DocModel } from "../../../prisma/zod";

const docRouter = router({
  get: procedure.input(z.string()).query(async ({ input }) => {
    const doc = await db.doc.findFirst({
      where: {
        id: input,
      },
      include: {
        blockArray: true,
      },
    });
    if (!doc) return doc;

    const sortedBlockArray = doc.blockArray.sort(
      (currBlock, nextBlock) =>
        doc.blockOrder.indexOf(currBlock.id) -
        doc.blockOrder.indexOf(nextBlock.id)
    );

    doc.blockArray = sortedBlockArray;
    return doc;
  }),

  getAll: procedure.input(z.void()).query(() => {
    return db.doc.findMany();
  }),

  create: procedure.input(DocModel.omit({ id: true })).mutation(({ input }) => {
    return db.doc.create({
      data: input,
    });
  }),

  updateBlockOrder: procedure
    .input(
      z.object({
        docId: z.string(),
        blockOrder: z.array(z.string()),
      })
    )
    .mutation(({ input }) => {
      return db.doc.update({
        where: {
          id: input.docId,
        },
        data: {
          blockOrder: input.blockOrder,
        },
      });
    }),
});
export default docRouter;
