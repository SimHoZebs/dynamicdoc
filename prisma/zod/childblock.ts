import * as z from "zod";
import { CompleteParentBlock, RelatedParentBlockModel } from "./index";

export const ChildBlockModel = z.object({
  id: z.string(),
  parentId: z.string().nullish(),
  text: z.string().nullish(),
  type: z.string().nullish(),
  special: z.string().nullish(),
  prevChildId: z.string().nullish(),
});

export interface CompleteChildBlock extends z.infer<typeof ChildBlockModel> {
  parent?: CompleteParentBlock | null;
  prevChild?: CompleteChildBlock | null;
  children: CompleteChildBlock[];
}

/**
 * RelatedChildBlockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedChildBlockModel: z.ZodSchema<CompleteChildBlock> = z.lazy(
  () =>
    ChildBlockModel.extend({
      parent: RelatedParentBlockModel.nullish(),
      prevChild: RelatedChildBlockModel.nullish(),
      children: RelatedChildBlockModel.array(),
    })
);
