import { DecoratorNode, NodeKey, LexicalNode } from "lexical";
import { ReactNode } from "react";
import Select from "./Select";

export class SelectNode extends DecoratorNode<ReactNode> {
  static getType() {
    return "Select";
  }

  static clone(node: SelectNode) {
    return new SelectNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM() {
    const span = document.createElement("span");
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <Select />;
  }
}

export function $createSelectNode() {
  return new SelectNode();
}

export function $isSelectNode(node: LexicalNode | null | undefined) {
  return node instanceof SelectNode;
}
