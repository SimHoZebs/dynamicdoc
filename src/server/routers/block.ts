import { z } from "zod";
import { ParentBlockModel, ChildBlockModel } from "../../../prisma/zod";
import db from "../../lib/util/db";
import { procedure, router } from "../trpc";

const blockRouter = router({
  get: procedure.input(z.string()).query(({ input }) => {
    return db.parentBlock.findFirst({
      where: {
        id: input,
      },
      include: {
        children: true,
      },
    });
  }),

  getAll: procedure.input(z.string()).query(({ input }) => {
    return db.parentBlock.findMany({
      where: {
        docId: input,
      },
      include: {
        children: true,
      },
    });
  }),

  create: procedure
    .input(ParentBlockModel.omit({ id: true }))
    .mutation(async ({ input }) => {
      const parentBlock = await db.parentBlock.create({
        data: input,
      });
      await db.childBlock.create({
        data: {
          parentId: parentBlock.id,
          text: "",
        },
      });

      return db.parentBlock.findFirst({
        where: {
          id: parentBlock.id,
        },
        include: {
          children: true,
        },
      });
    }),

  update: procedure.input(ChildBlockModel).mutation(({ input }) => {
    return db.childBlock.update({
      where: {
        id: input.id,
      },
      data: { text: input.text },
    });
  }),

  del: procedure.input(z.string()).mutation(({ input }) => {
    db.childBlock.deleteMany({
      where: {
        parentId: input,
      },
    });

    db.parentBlock.delete({
      where: {
        id: input,
      },
    });
  }),
});

export default blockRouter;
