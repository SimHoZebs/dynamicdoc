import { ElementNode, NodeKey, EditorConfig, LexicalEditor } from "lexical";

export class GroupItemNode extends ElementNode {
  static getType(): string {
    return "GroupItemNode";
  }

  static clone(node: GroupItemNode): GroupItemNode {
    return new GroupItemNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement("div");
    const parent = this.getParent();

    return element;
  }

  updateDOM(
    prevNode: unknown,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    return false;
  }
}

export function $createGroupItemNode(key?: NodeKey): GroupItemNode {
  return new GroupItemNode(key);
}

export function $isGroupItemNode(node: unknown): node is GroupItemNode {
  return node instanceof GroupItemNode;
}
