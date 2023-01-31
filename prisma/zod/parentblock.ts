import * as z from "zod"
import { Direction } from "@prisma/client"
import { CompleteChildBlock, RelatedChildBlockModel, CompleteDoc, RelatedDocModel } from "./index"

export const ParentBlockModel = z.object({
  id: z.string(),
  direction: z.nativeEnum(Direction),
  format: z.string(),
  indent: z.number().int().nullish(),
  type: z.string(),
  version: z.number().int(),
  docId: z.string().nullish(),
})

export interface CompleteParentBlock extends z.infer<typeof ParentBlockModel> {
  children: CompleteChildBlock[]
  Doc?: CompleteDoc | null
}

/**
 * RelatedParentBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedParentBlockModel: z.ZodSchema<CompleteParentBlock> = z.lazy(() => ParentBlockModel.extend({
  children: RelatedChildBlockModel.array(),
  Doc: RelatedDocModel.nullish(),
}))
