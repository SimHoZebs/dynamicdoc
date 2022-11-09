import { Prisma } from "@prisma/client";
import { Api } from "../../pages/api/page";
import req from "../util/req";

export default async function createPage(title: string, authorId: number) {
  const pageCreateInput = Prisma.validator<Prisma.PageCreateInput>()({
    title,
    author: {
      connect: {
        id: authorId
      }
    }
  }
  );

  return (await req<Awaited<ReturnType<Api["post"]>>>({
    method: "POST",
    url: "/page",
    data: { pageCreateInput }
  })).data;
};