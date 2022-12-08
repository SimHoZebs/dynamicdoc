import React, { useRef } from "react";

interface Props {
  line: string;
  index: number;
  setFocusedLineIndex: React.Dispatch<React.SetStateAction<number>>;
  setCaretPosition: React.Dispatch<React.SetStateAction<number>>;
  setContent: React.Dispatch<React.SetStateAction<string[]>>;
}

const Line = (props: Props) => {
  const inputElRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-full gap-x-4">
      <div className="">{props.index}</div>
      <input
        ref={inputElRef}
        onFocus={(e) => {
          const lineLength = e.currentTarget.value.length;
          props.setCaretPosition((prev) =>
            lineLength < prev ? lineLength : prev
          );
        }}
        onClick={() => {
          const caretPosition = inputElRef.current?.selectionStart;
          props.setFocusedLineIndex(props.index);

          if (caretPosition === undefined || caretPosition === null) return;
          props.setCaretPosition(caretPosition);
        }}
        className="w-full bg-dark-800 outline-none"
        spellCheck={false}
        onChange={(e) => {
          if (props.line > e.target.value) {
            props.setCaretPosition((prev) => prev - 1);
          } else if (props.line < e.target.value) {
            props.setCaretPosition((prev) => prev + 1);
          } else {
            return;
          }

          props.setContent((prev) => {
            const newContent = [...prev];
            newContent[props.index] = e.target.value;
            return newContent;
          });
        }}
        value={props.line}
      />
    </div>
  );
};

export default Line;
