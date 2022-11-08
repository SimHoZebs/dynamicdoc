import { Prisma, User } from "@prisma/client";
import axios from "axios";

export default async function createUser(name: string) {
  const userCreateInput = Prisma.validator<Prisma.UserCreateInput>()({
    name
  });

  return (await axios<User>({
    method: "POST",
    url: "http://localhost:3000/api/user",
    data: { userCreateInput }
  })).data;

}