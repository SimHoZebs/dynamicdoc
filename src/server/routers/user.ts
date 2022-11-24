import { z } from 'zod';
import db from '../../lib/util/db';
import { procedure, router } from '../trpc';

const userRouter = router({
  get: procedure
    .input(z.number())
    .query(({ input }) => {
      return db.user.findFirst({
        where: {
          id: input
        }
      });
    }),

  create: procedure
    .input(
      z.object({
        name: z.string()
      }))
    .mutation(({ input }) => {
      return db.user.create({
        data: input
      });
    }),

});
export default userRouter;