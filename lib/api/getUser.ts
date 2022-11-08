
import { User } from "@prisma/client";
import axios from "axios";

export default async function createUser(id: string) {

  return (await axios<User>({
    method: "GET",
    url: "http://localhost:3000/api/user",
    params: { id }
  })).data;

}