import { procedure, router } from "../trpc";
import { z } from 'zod';
import db from '../../lib/util/db';

const pageRouter = router({

  get: procedure
    .input(z.object({ id: z.number(), authorId: z.number() }))
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

      const sortedBlockArray = page.blockOrder.map((id) => {
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
    .input(z.number())
    .query(({ input }) => {
      return db.page.findMany({
        where: {
          authorId: input
        }
      });
    }),

  create: procedure
    .input(z.object({
      title: z.string(),
      authorId: z.number()
    }))
    .mutation(({ input }) => {
      return db.page.create({
        data: input
      });
    }),

  updateBlockOrder: procedure
    .input(
      z.object({
        pageId: z.number(),
        blockOrder: z.array(z.number())
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