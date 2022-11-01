import { Page, Prisma } from "@prisma/client";
import axios from "axios";

export default async function createNewPage(title: string, authorId: number) {
  const pageCreateInput = Prisma.validator<Prisma.PageCreateInput>()({
    title,
    author: {
      connect: {
        id: authorId
      }
    }
  }
  );

  return (await axios.post<Page>("http://localhost:3000/api/page", pageCreateInput)).data;
};