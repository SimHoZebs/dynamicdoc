import { DecoratorNode, LexicalNode, NodeKey } from "lexical";
import { ReactNode } from "react";
import NodeController from "../NodeController";

export class NodeControllerNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "node-controller";
  }

  static clone(node: NodeControllerNode): NodeControllerNode {
    return new NodeControllerNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("button");
    dom.className = "node-controller";
    return dom;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <NodeController />;
  }
}

export function $createNodeControllerNode(key?: string): NodeControllerNode {
  return new NodeControllerNode(key);
}

export function $isNodeControllerNode(node: LexicalNode): boolean {
  return node instanceof NodeControllerNode;
}
