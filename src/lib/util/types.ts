import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';


// TypeScript users only add this code

type CustomText = {
  text: string;
  italic?: boolean;
  bold?: boolean;
  strikethrough?: boolean;
};

type HeadingOneElement = { type: 'heading_one'; children: CustomText[]; };
type HeadingTwoElement = { type: 'heading_two'; children: CustomText[]; };
type HeadingThreeElement = { type: 'heading_three'; children: CustomText[]; };
type HeadingFourElement = { type: 'heading_four'; children: CustomText[]; };
type HeadingFiveElement = { type: 'heading_five'; children: CustomText[]; };
type HeadingSixElement = { type: 'heading_six'; children: CustomText[]; };
type ParagraphElement = { type: 'paragraph'; children: CustomText[]; };

export type CustomElement = HeadingOneElement | HeadingTwoElement | HeadingThreeElement | HeadingFourElement | HeadingFiveElement | HeadingSixElement | ParagraphElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}