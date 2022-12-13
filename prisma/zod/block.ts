import * as z from "zod"
import * as imports from "../null"
import { CompleteDoc, RelatedDocModel } from "./index"

export const BlockModel = z.object({
  docId: z.string(),
  id: z.string(),
  type: z.string().nullish(),
  text: z.string().nullish(),
  special: z.string().nullish(),
  childrenId: z.string().nullish(),
})

export interface CompleteBlock extends z.infer<typeof BlockModel> {
  doc: CompleteDoc
  parent?: CompleteBlock | null
  children?: CompleteBlock | null
}

/**
 * RelatedBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBlockModel: z.ZodSchema<CompleteBlock> = z.lazy(() => BlockModel.extend({
  doc: RelatedDocModel,
  parent: RelatedBlockModel.nullish(),
  children: RelatedBlockModel.nullish(),
}))
