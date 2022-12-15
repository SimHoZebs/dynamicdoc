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

/**
 * Slate's Descendant type expects Element to be either itself or a Text node.  This is because an Element can nest itself.
 * However, the DB schema is designed for Element (ParentBlock) to nest only ChildBlock nodes - The reason for different implementation is described in schema.prisma
 */
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: ParentBlockWithChildren;
    Text: ClientSideChildBlock;
  }
}
