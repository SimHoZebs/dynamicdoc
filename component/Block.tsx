import React, { useEffect, useRef, useState } from "react";
import { Block } from "../types";

interface Props {
  block: Block;
  index: number;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}

const Block = (props: Props) => {
  const blockRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    blockRef.current?.focus();
  }, []);

  return (
    <input
      ref={blockRef}
      className="outline-none bg-dark-800"
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
