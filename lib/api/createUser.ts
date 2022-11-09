import { Prisma } from "@prisma/client";
import { Api } from "../../pages/api/user";
import req from "../util/req";

export default async function createUser(name: string) {
  const userCreateInput = Prisma.validator<Prisma.UserCreateInput>()({
    name
  });

  return (await req<Awaited<ReturnType<Api["post"]>>>({
    method: "POST",
    url: "/user",
    data: { userCreateInput }
  })).data;

}