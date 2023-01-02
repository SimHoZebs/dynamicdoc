import * as z from "zod"
import { CompleteLexicalParentBlock, RelatedLexicalParentBlockModel } from "./index"

export const LexicalChildBlockModel = z.object({
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

export interface CompleteLexicalChildBlock extends z.infer<typeof LexicalChildBlockModel> {
  parent: CompleteLexicalParentBlock
}

/**
 * RelatedLexicalChildBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLexicalChildBlockModel: z.ZodSchema<CompleteLexicalChildBlock> = z.lazy(() => LexicalChildBlockModel.extend({
  parent: RelatedLexicalParentBlockModel,
}))
