import React, { useEffect, useRef } from "react";
import { ClientSideBlock } from "../util/types";

interface Props {
  block: ClientSideBlock;
  index: number;
  setBlockArray: React.Dispatch<React.SetStateAction<ClientSideBlock[]>>;
  setFocusedBlockIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Block = (props: Props) => {
  const blockRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    blockRef.current?.focus();
  }, []);

  return (
    <div className="flex w-full gap-x-4">
      <div className="">{props.index}</div>
      <input
        ref={blockRef}
        onFocus={() => {
          console.log("focused", props.index);
          props.setFocusedBlockIndex(props.index);
        }}
        className="w-full bg-dark-800 outline-none"
        spellCheck={false}
        onChange={(e) => {
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
