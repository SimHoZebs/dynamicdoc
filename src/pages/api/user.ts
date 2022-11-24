import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import apiEndpointHelper from "../../lib/util/apiEndpointHelper";
import db from "../../lib/util/db";
import { BackEndParams } from "../../lib/util/types";

type Data = Partial<{
  userCreateInput: Prisma.UserCreateInput;
}>;

type Params = Partial<{
  id: number;
}>;

export type Endpoint = {
  handler: typeof handler, data: Data, params: Params;
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body as Data;
  const params: BackEndParams<Params> = req.query;
  const { method } = req;

  const methodFunctions = {
    get: async () => {
      if (!params.id) throw new Error(`id is ${params.id}, does not exist.`);

      return await db.user.findFirst({
        where: {
          id: parseInt(params.id)
        },
      });
    },

    post: async () => {
      if (!data.userCreateInput) throw new Error(`userCreateInput is ${data.userCreateInput}, does not exist.`);

      return await db.user.create({
        data: data.userCreateInput
      });
    },
  };

  const { status, response } = await apiEndpointHelper<typeof methodFunctions>(method, methodFunctions);

  res.status(status).json(response);

  return methodFunctions;
}