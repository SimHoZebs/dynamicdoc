import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import React, { useEffect } from "react";
import { $createSelectNode } from "../component/SelectNode";

export const INSERT_SELECT_COMMAND = createCommand();

const SelectPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const deregisterCommand = editor.registerCommand(
      INSERT_SELECT_COMMAND,
      (payload: string) => {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const selectNode = $createSelectNode();
            selection.insertNodes([selectNode]);
          }
        });
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
    return () => {
      deregisterCommand();
    };
  }, [editor]);

  return null;
};

export default SelectPlugin;
