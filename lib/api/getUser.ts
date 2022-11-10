import { Endpoint } from "../../pages/api/user";
import req from "../util/req";

export default async function createUser(id: number) {

  return (await req<Endpoint, "get">({
    method: "GET",
    url: "user",
    params: { id }
  })).data;

}