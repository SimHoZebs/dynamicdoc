import { Prisma } from "@prisma/client";
import { Endpoint } from "../../pages/api/page";
import req from "../util/req";

export default async function createBlock(content: string, pageId: number) {
  const blockCreateInput: Prisma.BlockCreateInput = {
    type: "string",
    content,
    page: {
      connect: {
        id: pageId
      }
    }
  };

  return (await req<Endpoint, "patch">({
    method: "patch",
    url: "page",
    data: { blockCreateInput }
  })).data;

}