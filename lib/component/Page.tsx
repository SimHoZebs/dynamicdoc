import React, { useEffect, useRef, useState } from "react";
import { Block as IBlock } from "@prisma/client";
import Block from "./Block";
import addBlockToPage from "../api/createBlock";
import { PageWithBlockArray } from "../util/types";

const Page = (props: PageWithBlockArray) => {
  const [blockArray, setBlockArray] = useState<IBlock[]>(props.blockArray);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const pageRefEl = pageRef.current;

    /**
     * Creates a new block and sets the cursor focus to the new block.
     * Runs every time the user presses `enter` or clicks on the document outside of a block.
     */
    const createBlock = async (e: KeyboardEvent | MouseEvent) => {
      if (
        ("key" in e && e.key === "Enter") ||
        (e.type === "click" && e.target === e.currentTarget)
      ) {
        //For now, the client doesn't get a new block until the server responds
        //This is because the client doesn't know the id of the new block
        //Creating a new block without id will require a way for id-less block and id-ed block to coexist
        //or a way to update the id of the block after the server responds
        //The block should do nothing regarding its id until then.
        const newBlock = await addBlockToPage("", "", props.id);

        //reactivate once newBlock is implmented in api
        // setBlockArray((prev) => {
        //   return [...prev, newBlock];
        // });
      }
    };

    /**
     * Handles arrow key navigation. Selects a child element within page and iterates through them based on arrow key presses.
     * @param e
     * @returns
     */
    const arrowNavigation = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const map = { ArrowUp: -1, ArrowDown: 1 };

        const focusedBlock = document.activeElement as HTMLInputElement | null;
        if (!focusedBlock) return;

        const blockArray = Array.from(pageRefEl.children) as HTMLInputElement[];
        const currentIndex = blockArray.indexOf(focusedBlock);
        const nextIndex = currentIndex + map[e.key];

        if (nextIndex < 0) return;
        else if (nextIndex >= blockArray.length) {
          createBlock(e);
        }
        blockArray[currentIndex + map[e.key]].focus();
      }
    };

    pageRefEl.addEventListener("keypress", createBlock);
    pageRefEl.addEventListener("keydown", arrowNavigation);
    pageRefEl.addEventListener("click", createBlock);

    return () => {
      pageRefEl.removeEventListener("keypress", createBlock);
      pageRefEl.removeEventListener("keydown", arrowNavigation);
      pageRefEl.removeEventListener("click", createBlock);
    };
  }, [blockArray.length, props.id]);

  return (
    <div className="flex h-full w-full flex-col p-3" ref={pageRef}>
      <input className="bg-inherit text-4xl" value={props.title} />

      {blockArray.map((block, index) => (
        <Block
          key={index}
          block={block}
          index={index}
          setBlockArray={setBlockArray}
        />
      ))}
    </div>
  );
};

export default Page;
