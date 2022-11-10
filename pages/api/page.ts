import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import apiEndpointHelper from '../../lib/util/apiEndpointHelper';
import db from "../../lib/util/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, query, method } = req;
  const params = {
    get: parseInt(query.authorId as string)
  };

  const data = {
    post: body.pageCreateInput as Prisma.PageCreateInput
  };

  const methodFunctions = {
    get: async () => await db.page.findFirst({
      where: {
        authorId: params.get
      },
      include: {
        blockArray: true
      }
    })
    ,

    post: async () => await db.page.create({ data: data.post })
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(method, methodFunctions);

  res.status(status).json(response);

  return { methodFunctions, params, data };
}