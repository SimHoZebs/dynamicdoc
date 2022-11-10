import req from "../util/req";
import { Endpoint } from "../../pages/api/page";

/**
 * get pageArray
 * @param userId 
 * @returns 
 */
export async function getAllPages(userId: number) {

  const data = (await req<Endpoint, "get">({
    method: "GET",
    url: "page",
    params: { authorId: userId }
  })).data;

  if (data && !("blockArray" in data)) {
    return data;
  }
  else {
    return null;
  }
}