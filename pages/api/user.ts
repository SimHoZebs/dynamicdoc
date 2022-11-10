import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import apiEndpointHelper from "../../lib/util/apiEndpointHelper";
import db from "../../lib/util/db";

export type Endpoint = Awaited<ReturnType<typeof handler>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, query, method } = req;

  const params = {
    get: parseInt(query.id as string)
  };

  const data = {
    post: body.userCreateInput as Prisma.UserCreateInput
  };

  const methodFunctions = {
    get: async () => {
      return await db.user.findFirst({
        where: {
          id: params.get
        },
      });
    },

    post: async () => {
      return await db.user.create({
        data: data.post
      });
    },
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(method, methodFunctions);

  res.status(status).json(response);

  return { methodFunctions, params, data };
}