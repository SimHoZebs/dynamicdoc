import req from "../util/req";
import Endpoint from "../../pages/api/page";
import { Prisma } from "@prisma/client";

type test = Awaited<ReturnType<typeof Endpoint>>["params"];

/**
 * get pageArray
 * @param userId 
 * @returns 
 */
export async function getAllPages(userId: number) {
  const pageFindMany: Prisma.PageFindManyArgs = {
    where: {
      authorId: userId
    }
  };
  const data = (await req<typeof Endpoint, "get">({
    method: "GET",
    url: "page",
    params: { pageFindMany }
  })).data;

  if (data && !("blockArray" in data)) {
    return data;
  }
  else {
    return null;
  }
}