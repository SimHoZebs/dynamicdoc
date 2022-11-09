import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import apiEndpointHelper from '../../lib/util/apiEndpointHelper';
import db from "../../lib/util/db";

type Body = {
  authorId: number;
  pageCreateInput: Prisma.PageCreateInput;
};

export type Api = Awaited<ReturnType<typeof handler>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: Body = req.body;

  const methodFunctions = {
    get: async () => await db.page.findFirst({
      where: {
        authorId: body.authorId
      },
      include: {
        blockArray: true
      }
    })
    ,

    post: async () => await db.page.create({ data: body.pageCreateInput })
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(req, methodFunctions);

  res.status(status).json(response);

  return methodFunctions;
}