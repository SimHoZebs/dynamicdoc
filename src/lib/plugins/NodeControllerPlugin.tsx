import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  createCommand,
  LexicalEditor,
  $getNodeByKey,
  $isParagraphNode,
  $createTextNode,
  COMMAND_PRIORITY_EDITOR,
  ParagraphNode,
} from "lexical";
import { useEffect } from "react";
import { NodeControllerNode } from "../component/nodes/NodeControllerNode";
import { mergeRegister } from "@lexical/utils";

export const NEW_PARAGRAPH_COMMAND = createCommand<string>();

export default function NodeControllerPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      registerNewParagraphCommand(editor),
      findCreatedParagraph(editor)
    );
  }, [editor]);

  return null;
}

function registerNewParagraphCommand(editor: LexicalEditor) {
  return editor.registerCommand(
    NEW_PARAGRAPH_COMMAND,
    (key) => {
      const node = $getNodeByKey(key);
      if (!$isParagraphNode(node)) return false;

      const newTextNode = $createTextNode("");
      node.append(new NodeControllerNode(), newTextNode);
      newTextNode.select();

      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );
}

function findCreatedParagraph(editor: LexicalEditor) {
  return editor.registerMutationListener(ParagraphNode, (mutatedNodes) => {
    for (let [nodeKey, mutation] of mutatedNodes) {
      if (mutation === "created") {
        editor.dispatchCommand(NEW_PARAGRAPH_COMMAND, nodeKey);
      }
    }
  });
}
