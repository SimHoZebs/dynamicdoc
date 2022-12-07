import React, { useRef } from "react";

interface Props {
  content: string;
  index: number;
  setFocusedBlockIndex: React.Dispatch<React.SetStateAction<number>>;
  setCaretPosition: React.Dispatch<React.SetStateAction<number>>;
  setBlockArray: React.Dispatch<React.SetStateAction<string[]>>;
}

const Block = (props: Props) => {
  const blockRef = useRef<HTMLInputElement>(null);

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
          props.setBlockArray((prev) => {
            const newBlockArray = [...prev];
            newBlockArray[props.index] = e.target.value;
            return newBlockArray;
          });
        }}
        value={props.content}
      />
    </div>
  );
};

export default Block;
