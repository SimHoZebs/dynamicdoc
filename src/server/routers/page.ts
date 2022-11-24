import { procedure, router } from "../trpc";
import { z } from 'zod';
import db from '../../lib/util/db';

const pageRouter = router({

  get: procedure
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

});
export default pageRouter;