import React, { useEffect, useRef, useState } from "react";
import { Block as IBlock } from "@prisma/client";
import Block from "./Block";
import { PageWithBlockArray } from "../util/types";

const Page = (props: PageWithBlockArray) => {
  const [blockArray, setBlockArray] = useState<IBlock[]>(props.blockArray);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!documentRef.current) return;
    const documentRefCurrent = documentRef.current;

    /**
     * Creates a new block and sets the cursor focus to the new block.
     * Runs every time the user presses `enter` or clicks on the document outside of a block.
     */
    const createBlock = (e: KeyboardEvent | MouseEvent) => {
      if (
        ("key" in e && e.key === "Enter") ||
        (e.type === "click" && e.target === e.currentTarget)
      ) {
        //Need to auto generate id
        const newBlock: IBlock = {
          type: "text",
          content: "empty",
          id: 0,
          pageId: 0,
        };

        setBlockArray((prev) => {
          return [...prev, newBlock];
        });
      }
    };

    const arrowNavigation = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const map = { ArrowUp: -1, ArrowDown: 1 };

        const focusedBlock = document.activeElement as HTMLInputElement | null;
        if (!focusedBlock) return;

        const blockArray = Array.from(
          documentRefCurrent.children
        ) as HTMLInputElement[];
        const currentIndex = blockArray.indexOf(focusedBlock);
        blockArray[currentIndex + map[e.key]].focus();
      }
    };

    documentRefCurrent.addEventListener("keypress", createBlock);
    documentRefCurrent.addEventListener("keydown", arrowNavigation);
    documentRefCurrent.addEventListener("click", createBlock);

    return () => {
      documentRefCurrent.removeEventListener("keypress", createBlock);
      documentRefCurrent.removeEventListener("keydown", arrowNavigation);
      documentRefCurrent.removeEventListener("click", createBlock);
    };
  }, [blockArray.length]);

  return (
    <div className="flex h-full w-full flex-col p-3" ref={documentRef}>
      <input className="bg-inherit text-4xl" value={props.title} />

      {blockArray.map((block, index) => (
        <Block
          key={index}
          block={block}
          index={index}
          setBlocks={setBlockArray}
        />
      ))}
    </div>
  );
};

export default Page;
