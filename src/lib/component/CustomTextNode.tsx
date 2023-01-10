import { EditorConfig, LexicalNode, NodeKey, TextNode } from "lexical";

export class PropertiesNode extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  static getType() {
    return "colored";
  }

  static clone(node: PropertiesNode) {
    return new PropertiesNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.className = "bg-red-400";
    return element;
  }

  updateDOM(prevNode: PropertiesNode, dom: HTMLElement, config: EditorConfig) {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    return isUpdated;
  }
}

export function $createPropertiesNode(text: string) {
  return new PropertiesNode(text);
}

export function $isPropertiesNode(node: LexicalNode | null | undefined) {
  return node instanceof PropertiesNode;
}
