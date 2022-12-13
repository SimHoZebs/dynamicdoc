import { z } from "zod";
import { BlockModel } from "../../../prisma/zod";
import db from "../../lib/util/db";
import { procedure, router } from "../trpc";

const blockRouter = router({
  get: procedure.input(z.string()).query(({ input }) => {
    return db.block.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getAll: procedure.input(z.string()).query(({ input }) => {
    return db.block.findMany({
      where: {
        docId: input,
      },
      include: {
        children: true,
      },
    });
  }),

  create: procedure.input(BlockModel).mutation(({ input }) => {
    return db.block.create({
      data: input,
    });
  }),

  update: procedure.input(BlockModel).mutation(({ input }) => {
    return db.block.update({
      where: {
        id: input.id,
      },
      data: { text: input.text },
    });
  }),

  del: procedure.input(z.string()).mutation(({ input }) => {
    return db.block.delete({
      where: {
        id: input,
      },
    });
  }),
});

export default blockRouter;
