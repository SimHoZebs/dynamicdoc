import { NextApiRequest, NextApiResponse } from 'next';
import db from "../../lib/util/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const body = req.body;
  let response;

  switch (method) {
    case 'GET':
      response = await db.page.findFirst({
        where: {
          authorId: body.authorId
        },
      });
      break;

    case 'POST':
      response = await db.page.create({ data: body.pageCreateInput });
      break;
  }

  try {
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
}