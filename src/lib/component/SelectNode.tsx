import {
  DecoratorNode,
  NodeKey,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import Select from "./Select";

type SerializedSelectNode = Spread<
  {
    optionIndex: number;
  },
  SerializedLexicalNode
>;

export class SelectNode extends DecoratorNode<ReactNode> {
  __optionIndex: number;

  static getType() {
    return "Select";
  }

  static clone(node: SelectNode) {
    return new SelectNode(0, node.__key);
  }

  constructor(optionIndex: number, key?: NodeKey) {
    super(key);
    this.__optionIndex = optionIndex;
  }

  createDOM() {
    const span = document.createElement("span");
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <Select selectedOption={this.__optionIndex} />;
  }

  static importJSON(jsonNode: SerializedSelectNode) {
    return $createSelectNode(jsonNode.optionIndex);
  }

  exportJSON(): SerializedSelectNode {
    return {
      type: SelectNode.getType(),
      version: 1,
      optionIndex: this.__optionIndex,
    };
  }
}

export function $createSelectNode(optionIndex = 0) {
  return new SelectNode(optionIndex);
}

export function $isSelectNode(node: LexicalNode | null | undefined) {
  return node instanceof SelectNode;
}
