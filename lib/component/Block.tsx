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
          props.setFocusedBlockIndex(props.index);
        }}
        className="w-full bg-dark-800 outline-none"
        spellCheck={false}
        onChange={(e) => {
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
