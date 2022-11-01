import React, { useEffect, useRef } from "react";
import { Block } from "@prisma/client";

interface Props {
  block: Block;
  index: number;
  setBlockArray: React.Dispatch<React.SetStateAction<Block[]>>;
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
        props.setBlockArray((prev) => {
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
