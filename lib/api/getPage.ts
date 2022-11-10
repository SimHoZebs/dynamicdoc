import Endpoint from "../../pages/api/page";
import req from "../util/req";

/**
 * 
 * @param id 
 * @returns `Page` with `BlockArray` if page with id `id` exists; `null` otherwise.
 */
export default async function getPage(id: number) {

  return (await req<typeof Endpoint, "get">({
    method: "GET",
    url: `page?${id}`,
  })).data;
}