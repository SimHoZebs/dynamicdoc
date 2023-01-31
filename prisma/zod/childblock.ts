import * as z from "zod"
import { CompleteParentBlock, RelatedParentBlockModel } from "./index"

export const ChildBlockModel = z.object({
  id: z.string(),
  parentId: z.string(),
  detail: z.number().int(),
  format: z.number().int(),
  mode: z.string(),
  style: z.string(),
  text: z.string(),
  type: z.string(),
  version: z.number().int(),
})

export interface CompleteChildBlock extends z.infer<typeof ChildBlockModel> {
  parent: CompleteParentBlock
}

/**
 * RelatedChildBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedChildBlockModel: z.ZodSchema<CompleteChildBlock> = z.lazy(() => ChildBlockModel.extend({
  parent: RelatedParentBlockModel,
}))
