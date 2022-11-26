import { z } from 'zod';
import db from '../../lib/util/db';
import { procedure, router } from '../trpc';

const blockRouter = router({
  get: procedure
    .input(z.number())
    .mutation(({ input }) => {
      return db.block.findFirst({
        where: {
          id: input
        }
      });
    }),

  create: procedure
    .input(
      z.object({
        type: z.string(),
        content: z.string(),
        pageId: z.number()
      }))
    .mutation(({ input }) => {
      return db.block.create({
        data: input
      });
    }),

  update: procedure
    .input(z.object({
      id: z.number(),
      content: z.string()
    }))
    .mutation(({ input }) => {
      console.log("updating block");

      return db.block.update({
        where: {
          id: input.id
        },
        data: { content: input.content }
      });
    }),

  del: procedure
    .input(z.number())
    .mutation(({ input }) => {
      return db.block.delete({
        where: {
          id: input
        }
      });
    })
});

export default blockRouter;