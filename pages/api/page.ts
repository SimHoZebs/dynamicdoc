import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import apiEndpointHelper from '../../lib/util/apiEndpointHelper';
import db from "../../lib/util/db";

type Params = Partial<{
  userId: number;
  allPages: boolean;
  pageFindMany: Prisma.PageFindManyArgs;
}>;

type Data = Partial<{
  pageCreateInput: Prisma.PageCreateInput;
}>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const params: Params = req.query;
  const data: Data = req.body;
  const { method } = req;

  const methodFunctions = {
    get: async () => {
      if (!params.userId) throw new Error("No userId provided.");

      if (params.pageFindMany) {
        return await db.page.findMany({
          where: {
            authorId: params.userId
          }
        });
      } else {
        return await db.page.findFirst({
          where: {
            authorId: params.userId
          },
          include: {
            blockArray: true
          }
        });
      }
    }
    ,

    post: async () => {
      if (!data.pageCreateInput) throw new Error(`pageCreateInput is ${data.pageCreateInput}. There may be a typo in the data field of API function.`);
      return await db.page.create({ data: data.pageCreateInput });
    }
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(method, methodFunctions);

  res.status(status).json(response);

  return { methodFunctions, params, data };
}