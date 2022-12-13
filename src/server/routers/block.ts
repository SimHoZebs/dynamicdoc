import { z } from 'zod';
import db from '../../lib/util/db';
import { procedure, router } from '../trpc';

const blockRouter = router({
  get: procedure
    .input(z.string())
    .query(({ input }) => {
      return db.block.findFirst({
        where: {
          id: input
        }
      });
    }),

  getAll: procedure
    .input(z.string())
    .query(({ input }) => {
      return db.block.findMany({
        where: {
          pageId: input
        }
      });
    }),

  create: procedure
    .input(
      z.object({
        type: z.string(),
        content: z.string(),
        pageId: z.string()
      }))
    .mutation(({ input }) => {
      return db.block.create({
        data: input
      });
    }),

  update: procedure
    .input(z.object({
      id: z.string(),
      content: z.string()
    }))
    .mutation(({ input }) => {
      return db.block.update({
        where: {
          id: input.id
        },
        data: { content: input.content }
      });
    }),

  del: procedure
    .input(z.string())
    .mutation(({ input }) => {
      return db.block.delete({
        where: {
          id: input
        }
      });
    })
});

export default blockRouter;