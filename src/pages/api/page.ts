import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import apiEndpointHelper from '../../lib/util/apiEndpointHelper';
import db from "../../lib/util/db";
import { BackEndParams } from '../../lib/util/types';

type Params = Partial<{
  id: number;
  authorId: number;
  blockArray: boolean;
}>;

type Data = Partial<{
  pageCreateInput: Prisma.PageCreateInput;
  blockCreateInput: Prisma.BlockCreateInput;
}>;

export type Endpoint = { handler: typeof handler; data: Data; params: Params; };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const params: BackEndParams<Params> = req.query;
  const data: Data = req.body;
  const { method } = req;

  const methodFunctions = {
    get: async () => {
      if (!params.authorId) throw new Error(`authorId does not exist`);

      if (!params.blockArray) {
        return await db.page.findMany({
          where: {
            authorId: parseInt(params.authorId)
          }
        });
      }

      else {
        if (!params.id) throw new Error("documentId does not exist");
        return await db.page.findFirst({
          where: {
            id: parseInt(params.id),
            authorId: parseInt(params.authorId)
          },
          include: {
            blockArray: true
          }
        });
      }
    },

    post: async () => {
      if (!data.pageCreateInput) throw new Error(`pageCreateInput is ${data.pageCreateInput}. There may be a typo in the data field of API function.`);

      return await db.page.create({ data: data.pageCreateInput });
    },

    patch: async () => {
      if (!data.blockCreateInput) throw new Error(`blockCreateInput does not exist`);
      return await db.block.create({ data: data.blockCreateInput });
    }
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(method, methodFunctions);

  res.status(status).json(response);
  return methodFunctions;
}