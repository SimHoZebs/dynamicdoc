import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { Block, Doc } from "@prisma/client";
import { VFile } from "vfile/lib";

export type ClientSideBlock = Omit<Block, "id"> | Block;

export interface PageWithBlocks extends Doc {
  blockArray: ClientSideBlock[];
}

export interface DocWithContent extends Doc {
  slateAST: VFile;
}

type CustomText = {
  text: string;
  italic?: boolean;
  bold?: boolean;
  strikethrough?: boolean;
  property?: boolean;
  type?: "property";
};

type HeadingOneElement = { type: "heading_one"; children: CustomText[] };
type HeadingTwoElement = { type: "heading_two"; children: CustomText[] };
type HeadingThreeElement = { type: "heading_three"; children: CustomText[] };
type HeadingFourElement = { type: "heading_four"; children: CustomText[] };
type HeadingFiveElement = { type: "heading_five"; children: CustomText[] };
type HeadingSixElement = { type: "heading_six"; children: CustomText[] };
type ParagraphElement = { type: "paragraph"; children: CustomText[] };
type PropertyElement = { type: "property"; children: CustomText[] };

export type CustomElement =
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | ParagraphElement
  | PropertyElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
