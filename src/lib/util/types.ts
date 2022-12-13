import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { ParentBlock, Doc, ChildBlock } from "@prisma/client";
import { CompleteChildBlock, CompleteParentBlock } from "../../../prisma/zod";

export type ParentBlockWithChildren = ParentBlock & {
  children: ChildBlock[];
};

export type DocWithContent = Doc & {
  content: ParentBlockWithChildren[];
};

type HeadingOneElement = { type: "heading_one"; children: ChildBlock[] };
type HeadingTwoElement = { type: "heading_two"; children: ChildBlock[] };
type HeadingThreeElement = { type: "heading_three"; children: ChildBlock[] };
type HeadingFourElement = { type: "heading_four"; children: ChildBlock[] };
type HeadingFiveElement = { type: "heading_five"; children: ChildBlock[] };
type HeadingSixElement = { type: "heading_six"; children: ChildBlock[] };
type ParagraphElement = { type: "paragraph"; children: ChildBlock[] };
type PropertyElement = { type: "property"; children: ChildBlock[] };

export type CustomElement =
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | ParagraphElement
  | PropertyElement;

// Slate's Descendant type expects Element to be either itself or a Text node for cases where an Element nests another Element (list).
// The problem is, our DB does not expect ParentBlock (Element) to nest itself, but only ChildBlock nodes - a block designed that can fufill the function of a ParentBlock.
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ParentBlockWithChildren | ChildBlock;
    Text: ChildBlock;
  }
}
