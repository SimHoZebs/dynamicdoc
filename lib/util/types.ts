import { Prisma } from "@prisma/client";

//This makes it so that there is two places to get types, which is not ideal.
//How do I solve that?
export type PageWithBlockArray = Prisma.PageGetPayload<{
  include: { blockArray: true; };
}>;
