import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { ParentBlock, Doc, ChildBlock } from "@prisma/client";

export type ParentBlockWithChildren = Omit<ParentBlock, "id"> & {
  id: string | null;
  children: ClientSideChildBlock[];
};

export type ClientSideChildBlock = Omit<ChildBlock, "id"> & {
  id: string | null;
};

export type DocWithContent = Doc & {
  content: ParentBlockWithChildren[];
};

export type CustomElement = {
  type:
    | "heading_one"
    | "heading_two"
    | "heading_three"
    | "heading_four"
    | "heading_five"
    | "heading_six"
    | "paragraph"
    | "property";
  children: ClientSideChildBlock[];
};

// Slate's Descendant type expects Element to be either itself or a Text node for cases where an Element nests another Element (list).
// The problem is, our DB does not expect ParentBlock (Element) to nest itself, but only ChildBlock nodes - a block designed that can fufill the function of a ParentBlock.
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ParentBlockWithChildren | ClientSideChildBlock;
    Text: ClientSideChildBlock;
  }
}
