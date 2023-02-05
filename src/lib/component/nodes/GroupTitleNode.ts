import { EditorConfig, ElementNode, LexicalEditor, NodeKey } from "lexical";

export class GroupTitleNode extends ElementNode {
  static getType(): string {
    return "GroupTitleNode";
  }

  static clone(node: GroupTitleNode): GroupTitleNode {
    return new GroupTitleNode(node.__key);
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("div");
    return dom;
  }
  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return false;
  }
}

export function $createGroupTitleNode(key?: NodeKey): GroupTitleNode {
  return new GroupTitleNode(key);
}

export function $isGroupTitleNode(node: unknown): node is GroupTitleNode {
  return node instanceof GroupTitleNode;
}
