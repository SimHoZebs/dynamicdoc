import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../lib/util/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const body = req.body;

  switch (method) {
    case 'GET':

      const page = await db.page.findFirst({
        where: {
          authorId: body.authorId
        },
      });

      try {
        res.status(200).json(page);
      } catch (error) {
        res.status(400).json(error);
      }
      break;

  }
}