import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import apiEndpointHelper from "../../lib/util/apiEndpointHelper";
import db from "../../lib/util/db";

type Body = {
  userCreateInput: Prisma.UserCreateInput;
};

export type Api = Awaited<ReturnType<typeof handler>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: Body = req.body;
  const { id } = req.query;

  const methodFunctions = {
    get: async () => {
      return await db.user.findFirst({
        where: {
          id: parseInt(id as string)
        },
      });
    },

    post: async () => {
      return await db.user.create({
        data: body.userCreateInput
      });
    },
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(req, methodFunctions);

  res.status(status).json(response);

  return methodFunctions;
}