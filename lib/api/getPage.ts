import axios from "axios";
import req from "../util/req";

/**
 * 
 * @param id 
 * @returns `Page` with `BlockArray` if page with id `id` exists; `null` otherwise.
 */
export default async function getPage(id: number) {

  return (await req({
    method: "GET",
    url: `/page?${id}`,
  })).data;
}