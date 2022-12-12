import { procedure, router } from "../trpc";
import { z } from 'zod';
import db from '../../lib/util/db';

const pageRouter = router({
  get: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const page = await db.page.findFirst({
        where: {
          ...input
        },
        include: {
          blockArray: true
        }
      });
      if (!page) return page;

      const blockOrder = page.blockOrder.split(",").map((id) => (id));
      const sortedBlockArray = blockOrder.map((id) => {
        const block = page.blockArray.find(block => block.id === id);
        return block
          ? block
          : {
            id: id,
            type: "",
            pageId: input.id,
            content: "This line was found, but could not find the content."
          };
      });

      page.blockArray = sortedBlockArray;
      return page;
    }),

  getAll: procedure
    .input(z.void())
    .query(() => {
      return db.page.findMany();
    }),

  create: procedure
    .input(z.object({
      title: z.string(),
      blockOrder: z.string()
    }))
    .mutation(({ input }) => {
      return db.page.create({
        data: input
      });
    }),

  updateBlockOrder: procedure
    .input(
      z.object({
        pageId: z.string(),
        blockOrder: z.string()
      })
    )
    .mutation(({ input }) => {
      return db.page.update({
        where: {
          id: input.pageId
        },
        data: {
          blockOrder: input.blockOrder
        }
      });
    })
});
export default pageRouter;