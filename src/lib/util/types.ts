import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';


// TypeScript users only add this code

type CustomText = { text: string; };

type HeadingOneElement = { type: 'heading_one'; children: CustomText[]; };

export type CustomElement = HeadingOneElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}