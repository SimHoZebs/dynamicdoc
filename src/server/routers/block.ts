import { z } from 'zod';
import db from '../../lib/util/db';
import { procedure, router } from '../trpc';

const blockRouter = router({
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
    })
});

export default blockRouter;