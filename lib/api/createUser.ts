import { User } from "@prisma/client";
import axios from "axios";

export default async function createUser(name: string) {
  return await axios.post<User>("http://localhost:3000/api/createUser", name);

}