import Endpoint from "../../pages/api/page";
import req from "../util/req";

/**
 * Returns a single page with `blockArray`.
 * @param userId 
 * @returns `null` if there are no pages.
 */
export default async function getPage(userId: number) {

  const data = (await req<typeof Endpoint, "get">({
    method: "GET",
    url: "page",
    params: { userId: userId.toString() }
  })).data;

  if (data && ("blockArray" in data)) {
    return data;
  }
  else {
    return null;
  }
}