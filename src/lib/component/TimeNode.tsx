import { DecoratorNode, NodeKey, LexicalNode } from "lexical";
import { ReactNode } from "react";
import Time from "./Time";

export class TimeNode extends DecoratorNode<ReactNode> {
  static getType() {
    return "Time";
  }

  static clone(node: TimeNode) {
    return new TimeNode(node.__key);
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
    return <Time />;
  }
}

export function $createTimeNode() {
  return new TimeNode();
}

export function $isTimeNode(node: LexicalNode | null | undefined) {
  return node instanceof TimeNode;
}
