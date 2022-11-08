import { Prisma, User } from "@prisma/client";
import req from "../util/req";

export default async function createUser(name: string) {
  const userCreateInput = Prisma.validator<Prisma.UserCreateInput>()({
    name
  });

  return (await req<User>({
    method: "POST",
    url: "/user",
    data: { userCreateInput }
  })).data;

}