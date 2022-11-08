import { Page, Prisma } from "@prisma/client";
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

  return (await req<Page>({
    method: "POST",
    url: "/page",
    data: { pageCreateInput }
  })).data;
};