import { ParentBlock, Doc, ChildBlock } from "@prisma/client";

export type ParentBlockWithChildren = Omit<ParentBlock, "id"> & {
  id: string | null;
  children: ClientSideChildBlock[];
};

export type ClientSideChildBlock = Omit<ChildBlock, "id"> & {
  id: string | null;
  children?: ClientSideChildBlock[];
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
