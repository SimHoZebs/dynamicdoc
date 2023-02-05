import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $createGroupContainerNode,
  GroupContainerNode,
} from "../component/nodes/GroupContainerNode";
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
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";

export const INSERT_GROUP_COMMAND = createCommand<void>();

export default function GroupPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([GroupContainerNode, GroupTitleNode, GroupItemNode])) {
      throw new Error(
        "GropuPlugin: GroupContainerNode, GroupTitleNode, or GroupItemNode are not registered on editor."
      );
    }
    return mergeRegister(
      editor.registerCommand(
        INSERT_GROUP_COMMAND,
        () => {
          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              return;
            }

            const title = $createGroupTitleNode();
            const content = $createGroupItemNode().append(
              $createParagraphNode()
            );
            const container = $createGroupContainerNode().append(
              title,
              content
            );
            selection.insertNodes([container]);
            title.selectStart();
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  });

  return null;
}
