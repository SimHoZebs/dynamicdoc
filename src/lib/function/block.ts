import db from "../util/db";

const block = {
  get: async (id: string) => {
    return db.block.findFirst({
      where: {
        id,
      },
    });
  },

  getAll: async (id: string) => {
    return db.block.findMany({
      where: {
        pageId: id,
      },
    });
  },

  create: async (type: string, pageId: string, content: string) => {
    return db.block.create({
      data: {
        type,
        pageId,
        content,
      },
    });
  },

  update: async (id: string, content: string) => {
    return db.block.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  },

  delete: async (id: string) => {
    return db.block.delete({
      where: {
        id,
      },
    });
  },
};
export default block;
