import axios from "axios";
import { PageWithBlockArray } from "../util/types";

/**
 * 
 * @param id 
 * @returns `Page` with `BlockArray` if page with id `id` exists; `null` otherwise.
 */
export default async function findPage(id: number) {

  return (await axios.get<PageWithBlockArray>(`http://localhost:3000/api/page?${id}`)).data;
}