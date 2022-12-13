import * as z from "zod"
import * as imports from "../null"
import { CompleteParentBlock, RelatedParentBlockModel } from "./index"

export const DocModel = z.object({
  id: z.string(),
  title: z.string(),
  blockOrder: z.string().array(),
})

export interface CompleteDoc extends z.infer<typeof DocModel> {
  blockArray: CompleteParentBlock[]
}

/**
 * RelatedDocModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDocModel: z.ZodSchema<CompleteDoc> = z.lazy(() => DocModel.extend({
  blockArray: RelatedParentBlockModel.array(),
}))
