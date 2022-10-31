import React, { useEffect, useRef, useState } from "react";
import { Block as IBlock } from "@prisma/client";

interface Props {
  block: IBlock;
  index: number;
  setBlocks: React.Dispatch<React.SetStateAction<IBlock[]>>;
}

const Block = (props: Props) => {
  const blockRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    blockRef.current?.focus();
  }, []);

  return (
    <input
      ref={blockRef}
      className="bg-dark-800 outline-none"
      spellCheck={false}
      onChange={(e) => {
        console.log(e.currentTarget.value);
        props.setBlocks((prev) => {
          const newBlockArray = [...prev];
          newBlockArray[props.index].content = e.target.value;
          return newBlockArray;
        });
      }}
      value={props.block.content}
    />
  );
};

export default Block;
