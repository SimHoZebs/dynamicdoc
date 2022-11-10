import { Prisma } from "@prisma/client";
import Endpoint from "../../pages/api/page";
import req from "../util/req";

export default async function createPage(title: string, authorId: number) {
  const pageCreateInput: Prisma.PageCreateInput = {
    title,
    author: {
      connect: {
        id: authorId
      }
    },
  };

  return (await req<typeof Endpoint, "post">({
    method: "POST",
    url: "page",
    data: { pageCreateInput }
  })).data;
};