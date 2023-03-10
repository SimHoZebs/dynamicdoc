import {
  EditorConfig,
  ElementNode,
  LexicalEditor,
  ParagraphNode,
} from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  __isBare = true;

  createDOM(_config: EditorConfig) {
    const dom = super.createDOM(_config);
    dom.className = "custom-paragraph";
    return dom;
  }

  updateDOM(_prevNode: unknown, dom: HTMLElement): boolean {
    return false;
  }

  isBare(): boolean {
    const self = this.getLatest();
    return self.__isBare;
  }

  setBare(isBare: boolean): void {
    const self = this.getWritable();
    self.__isBare = isBare;
  }
}
