import React, { useEffect, useRef } from "react";
import { ClientSideBlock } from "../util/types";

interface Props {
  block: ClientSideBlock;
  index: number;
  setBlockArray: React.Dispatch<React.SetStateAction<ClientSideBlock[]>>;
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
