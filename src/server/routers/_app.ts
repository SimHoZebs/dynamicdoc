import { router } from "../trpc";
import docRouter from "./doc";
import blockRouter from "./block";

export const appRouter = router({
  doc: docRouter,
  block: blockRouter,
});

export const caller = appRouter.createCaller({});

// export type definition of API
export type AppRouter = typeof appRouter;
