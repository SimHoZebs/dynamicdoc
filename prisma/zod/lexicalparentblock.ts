import * as z from "zod"
import { Direction } from "@prisma/client"
import { CompleteLexicalChildBlock, RelatedLexicalChildBlockModel } from "./index"

export const LexicalParentBlockModel = z.object({
  id: z.string(),
  direction: z.nativeEnum(Direction),
  format: z.string(),
  indent: z.number().int(),
  type: z.string(),
  version: z.number().int(),
})

export interface CompleteLexicalParentBlock extends z.infer<typeof LexicalParentBlockModel> {
  children: CompleteLexicalChildBlock[]
}

/**
 * RelatedLexicalParentBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLexicalParentBlockModel: z.ZodSchema<CompleteLexicalParentBlock> = z.lazy(() => LexicalParentBlockModel.extend({
  children: RelatedLexicalChildBlockModel.array(),
}))
