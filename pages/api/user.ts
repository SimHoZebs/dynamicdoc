import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/util/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const body = req.body;
  const { userId } = req.query;

  let response;

  switch (method) {
    case 'GET':
      if (!userId) return;

      response = await db.user.findFirst({
        where: {
          id: parseInt(userId as string)
        },
      });
      break;

    case 'POST':
      response = await db.user.create({
        data: body.userCreateInput
      });
      break;
  }

  try {
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
}