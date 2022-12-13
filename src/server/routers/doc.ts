import { procedure, router } from "../trpc";
import { z } from "zod";
import db from "../../lib/util/db";

const docRouter = router({
  get: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const doc = await db.doc.findFirst({
        where: {
          ...input,
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
              type: "",
              docId: input.id,
              content: "This line was found, but could not find the content.",
            };
      });

      doc.blockArray = sortedBlockArray;
      return doc;
    }),

  getAll: procedure.input(z.void()).query(() => {
    return db.doc.findMany();
  }),

  create: procedure
    .input(
      z.object({
        title: z.string(),
        blockOrder: z.string(),
      })
    )
    .mutation(({ input }) => {
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
