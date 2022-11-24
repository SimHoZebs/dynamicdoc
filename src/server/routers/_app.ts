import { router } from '../trpc';
import pageRouter from './page';
import userRouter from './user';
import blockRouter from './block';

export const appRouter = router({
  page: pageRouter,
  user: userRouter,
  block: blockRouter
});

export const caller = appRouter.createCaller({});

// export type definition of API
export type AppRouter = typeof appRouter;