import { Prisma } from "@prisma/client";
import { Endpoint } from "../../pages/api/user";
import req from "../util/req";

export default async function createUser(name: string) {
  const userCreateInput = Prisma.validator<Prisma.UserCreateInput>()({
    name
  });

  return (await req<Endpoint, "post">({
    method: "POST",
    url: "/user",
    data: { userCreateInput }
  })).data;

}