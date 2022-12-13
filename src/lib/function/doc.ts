import db from "../util/db";

const doc = {
  get: async (id: string) => {
    const doc = await db.doc.findFirst({
      where: {
        id,
      },
      include: {
        blockArray: true,
      },
    });
    if (!doc) return doc;

    const blockOrder = doc.blockOrder.split(",").map((id) => id);
    const sortedBlockArray = blockOrder.map((id) => {
      const block = doc.blockArray.find((block) => block.id === id);
      return block
        ? block
        : {
            id: id,
            type: "",
            pageId: id,
            content: "This line was found, but could not find the content.",
          };
    });

    doc.blockArray = sortedBlockArray;
    return doc;
  },

  getAll: async () => {
    return db.doc.findMany();
  },

  create: async (title: string, blockOrder: string) => {
    return db.doc.create({
      data: {
        title,
        blockOrder,
      },
    });
  },

  updateBlockOrder: async (id: string, blockOrder: string) => {
    return db.doc.update({
      where: {
        id,
      },
      data: {
        blockOrder,
      },
    });
  },
};
export default doc;
