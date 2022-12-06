import React, { useCallback, useEffect, useRef } from "react";
import debounce from "../util/debounce";
import { trpc } from "../util/trpc";
import { ClientSideBlock } from "../util/types";

interface Props {
  block: ClientSideBlock;
  index: number;
  setBlockArray: React.Dispatch<React.SetStateAction<ClientSideBlock[]>>;
  setFocusedBlockIndex: React.Dispatch<React.SetStateAction<number>>;
  setCaretPosition: React.Dispatch<React.SetStateAction<number>>;
}

const Block = (props: Props) => {
  const blockRef = useRef<HTMLInputElement>(null);
  const updateBlock = trpc.block.update.useMutation();

  //useCallback saves the function 'debounce'. when this function is called, it will use the same debounce function, accessing the same 'timer' variable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateBlockOnServer = useCallback(
    debounce(() => {
      if (!("id" in props.block)) return;

      updateBlock.mutate({
        id: props.block.id,
        content: props.block.content,
      });
    }),
    []
  );

  return (
    <div className="flex w-full gap-x-4">
      <div className="">{props.index}</div>
      <input
        ref={blockRef}
        onFocus={(e) => {
          const blockTextLength = e.currentTarget.value.length;
          props.setCaretPosition((prev) =>
            blockTextLength < prev ? blockTextLength : prev
          );
        }}
        onClick={() => {
          const caretPosition = blockRef.current?.selectionStart;
          props.setFocusedBlockIndex(props.index);

          if (caretPosition === undefined || caretPosition === null) return;
          props.setCaretPosition(caretPosition);
        }}
        className="w-full bg-dark-800 outline-none"
        spellCheck={false}
        onChange={(e) => {
          updateBlockOnServer();
          // this for some reason triggers when the block in front of it is deleted
          props.setBlockArray((prev) => {
            const newBlockArray = [...prev];
            newBlockArray[props.index].content = e.target.value;
            return newBlockArray;
          });
        }}
        value={props.block.content}
      />
    </div>
  );
};

export default Block;
