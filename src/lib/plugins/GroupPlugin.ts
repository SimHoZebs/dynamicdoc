import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { KeyboardEvent, useEffect } from "react";
import {
  $createGroupTitleNode,
  GroupTitleNode,
} from "../component/nodes/GroupTitleNode";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  KEY_TAB_COMMAND,
  LexicalEditor,
  ParagraphNode,
} from "lexical";
import { NodeControllerNode } from "../component/nodes/NodeControllerNode";

export const INSERT_GROUP_COMMAND = createCommand<string>();
export default function GroupPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GroupTitleNode])) {
      throw new Error(
        "GropuPlugin: GroupContainerNode, GroupTitleNode, or GroupItemNode are not registered on editor."
      );
    }

    const displayMenu = (event: MouseEvent) => {
      console.log("event", event.target);
    };

    return mergeRegister(arrowToGroup(editor), tabToGroup(editor));
  });

  return null;
}

function arrowToGroup(editor: LexicalEditor) {
  return editor.registerCommand(
    INSERT_GROUP_COMMAND,
    (payload: string) => {
      editor.update(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return;
        }

        const currParentNode = selection.getNodes()[0].getParent();
        if (!currParentNode) {
          return false;
        }

        const textContent = currParentNode.getTextContent();
        const groupContainer = $createGroupTitleNode().append(
          $createTextNode(payload)
        );
        const paragraph = $createParagraphNode().append(
          $createTextNode(textContent)
        );
        groupContainer.append(paragraph);

        currParentNode.replace(groupContainer);

        paragraph.selectEnd();
      });

      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );
}

function tabToGroup(editor: LexicalEditor) {
  return editor.registerCommand<KeyboardEvent>(
    KEY_TAB_COMMAND,
    (event) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      const currParentNode = selection.getNodes()[0].getParent();
      if (!currParentNode) {
        console.log("no parent node");
        return false;
      }

      //TODO: Don't do this if prevParent is a groupTitle
      const prevParentNodeKey = currParentNode.__prev;
      if (!prevParentNodeKey) {
        console.log("no prev node");
        return false;
      }

      event.preventDefault();
      const prevParentNode = $getNodeByKey(prevParentNodeKey);
      if (!prevParentNode) {
        console.log("no prev node");
        return false;
      }

      const groupContainer = $createGroupTitleNode().append(
        $createTextNode(prevParentNode?.getTextContent())
      );
      const paragraph = $createParagraphNode().append(
        $createTextNode(currParentNode.getTextContent())
      );

      groupContainer.append(paragraph);

      currParentNode.remove();
      prevParentNode.replace(groupContainer);
      paragraph.selectEnd();
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );
}
