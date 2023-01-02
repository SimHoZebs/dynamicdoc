import * as z from "zod"
import { CompleteDoc, RelatedDocModel, CompleteChildBlock, RelatedChildBlockModel } from "./index"

export const ParentBlockModel = z.object({
  docId: z.string(),
  id: z.string(),
  type: z.string(),
})

export interface CompleteParentBlock extends z.infer<typeof ParentBlockModel> {
  doc: CompleteDoc
  children: CompleteChildBlock[]
}

/**
 * RelatedParentBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedParentBlockModel: z.ZodSchema<CompleteParentBlock> = z.lazy(() => ParentBlockModel.extend({
  doc: RelatedDocModel,
  children: RelatedChildBlockModel.array(),
}))
