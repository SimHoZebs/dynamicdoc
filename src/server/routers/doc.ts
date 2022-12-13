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

    const sortedBlockArray = doc.blockOrder.map((id) => {
      const block = doc.blockArray.find((block) => block.id === id);
      return block
        ? block
        : {
            id: id,
            type: "paragraph",
            docId: input,
            text: "This block's ID was found, but content could not be found. I'd write a better error message, but I have no idea how this could even be possible.",
            childrenId: null,
            special: null,
          };
    });

    doc.blockArray = sortedBlockArray;
    return doc;
  }),

  getAll: procedure.input(z.void()).query(() => {
    return db.doc.findMany();
  }),

  create: procedure.input(DocModel).mutation(({ input }) => {
    return db.doc.create({
      data: input,
    });
  }),

  updateBlockOrder: procedure
    .input(
      z.object({
        docId: z.string(),
        blockOrder: z.string(),
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
