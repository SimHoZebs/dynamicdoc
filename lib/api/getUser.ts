import Endpoint from "../../pages/api/user";
import req from "../util/req";

export default async function createUser(id: string) {

  return (await req<typeof Endpoint, "get">({
    method: "GET",
    url: "user",
    params: { id }
  })).data;

}