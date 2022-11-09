import req from "../util/req";
import { PageWithBlockArray } from "../util/types";

/**
 * 
 * @param id 
 * @returns `Page` with `BlockArray` if page with id `id` exists; `null` otherwise.
 */
export default async function getPage(id: number) {

  return (await req<PageWithBlockArray>({
    method: "GET",
    url: `/page?${id}`,
  })).data;
}