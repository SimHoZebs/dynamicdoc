import { z } from 'zod';
import db from '../../lib/util/db';
import { procedure, router } from '../trpc';

export const appRouter = router({
  getUser: procedure
    .input(z.number())
    .query(({ input }) => {
      return db.user.findFirst({
        where: {
          id: input
        }
      });
    }),

  createUser: procedure
    .input(
      z.object({
        name: z.string()
      }))
    .mutation(({ input }) => {
      return db.user.create({
        data: input
      });
    }),

  getPage: procedure
    .input(z.object({ id: z.number(), authorId: z.number() }))
    .query(({ input }) => {
      return db.page.findFirst({
        where: {
          ...input
        },
        include: {
          blockArray: true
        }
      });
    }),

  getAllPages: procedure
    .input(z.number())
    .query(({ input }) => {
      return db.page.findMany({
        where: {
          authorId: input
        }
      });
    }),

  createPage: procedure
    .input(z.object({
      title: z.string(),
      authorId: z.number()
    }))
    .mutation(({ input }) => {
      return db.page.create({
        data: input
      });
    }),

  createBlock: procedure
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
    })

});

export const caller = appRouter.createCaller({});

// export type definition of API
export type AppRouter = typeof appRouter;