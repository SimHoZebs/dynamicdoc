import { Block, Prisma } from "@prisma/client";
import req from "../util/req";

export default async function createBlock(type: string, content: string, pageId: number) {
  const blockCreateInput = Prisma.validator<Prisma.BlockCreateInput>()({
    type,
    content,
    page: {
      connect: {
        id: pageId
      }
    }
  });

  return (await req<Block>({
    method: "PATCH",
    url: "/page",
    data: { blockCreateInput }
  })).data;

}