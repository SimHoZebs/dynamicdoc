import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        res.status(200).json("get");
      } catch (error) {
        res.status(400).json(error);
      }
      break;

  }
}