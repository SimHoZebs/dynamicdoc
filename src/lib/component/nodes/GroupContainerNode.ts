import {
  $applyNodeReplacement,
  EditorConfig,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
} from "lexical";

export class GroupContainerNode extends ElementNode {
  static getType(): string {
    return "GroupNode";
  }

  static clone(node: GroupContainerNode): GroupContainerNode {
    return new GroupContainerNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "group-container";
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

export function $createGroupContainerNode(): GroupContainerNode {
  return $applyNodeReplacement(new GroupContainerNode());
}

export function $isGroupContainerNode(
  node: LexicalNode
): node is GroupContainerNode {
  return node instanceof GroupContainerNode;
}
