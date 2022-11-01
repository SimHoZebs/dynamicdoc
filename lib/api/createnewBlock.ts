import { Block, Prisma } from "@prisma/client";
import axios from "axios";

export default async function createNewBlock(type: string, content: string, pageId: number) {
  const blockCreateInput = Prisma.validator<Prisma.BlockCreateInput>()({
    type,
    content,
    page: {
      connect: {
        id: pageId
      }
    }
  });

  return (await axios.patch<Block>("http://localhost:3000/api/page", blockCreateInput)).data;

}