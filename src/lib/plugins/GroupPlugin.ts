import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { KeyboardEvent, useEffect } from "react";
import {
  $createGroupItemNode,
  GroupItemNode,
} from "../component/nodes/GroupItemNode";
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
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  KEY_TAB_COMMAND,
} from "lexical";

export const INSERT_GROUP_COMMAND = createCommand<string>();

//TODO: when linebreak is inserted, create a new groupItem instead.
//TODO: When tab outdent, change parent groupTitle to grandparent. If there is no grandparent, become paragraph.
export default function GroupPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GroupTitleNode, GroupItemNode])) {
      throw new Error(
        "GropuPlugin: GroupContainerNode, GroupTitleNode, or GroupItemNode are not registered on editor."
      );
    }

    const displayMenu = (event: MouseEvent) => {
      console.log("event", event.target);
    };

    return mergeRegister(
      editor.registerCommand(
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
      ),

      editor.registerCommand<KeyboardEvent>(
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
      ),

      editor.registerRootListener((rootElement) => {
        rootElement?.addEventListener("click", displayMenu);
      })
    );
  });

  return null;
}
