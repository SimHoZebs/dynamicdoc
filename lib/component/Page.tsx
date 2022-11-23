import React, { useEffect, useRef, useState } from "react";
import Block from "./Block";
import addBlockToPage from "../api/createBlock";
import { ClientSideBlock, PageWithBlockArray } from "../util/types";

const Page = (props: PageWithBlockArray) => {
  const [title, setTitle] = useState(props.title);
  const [blockArray, setBlockArray] = useState<ClientSideBlock[]>(
    props.blockArray
  );
  const pageRef = useRef<HTMLDivElement>(null);
  const [focusedBlockIndex, setFocusedBlockIndex] = useState<number>(0);

  useEffect(() => {
    if (!pageRef.current) return;
    const pageRefEl = pageRef.current;

    /**
     * Creates a new block and sets the cursor focus to the new block.
     * Runs every time the user presses `enter` or clicks on the document outside of a block.
     */
    const createBlock = async () => {
      console.log("creating new block");
      const newBlock: ClientSideBlock = {
        type: "",
        content: "",
        pageId: props.id,
      };

      setBlockArray((prev) => {
        return [...prev, newBlock];
      });

      addBlockToPage("", props.id);
    };

    /**
     * Handles arrow key navigation. Selects a child element within page and iterates through them based on arrow key presses.
     * @param e
     * @returns
     */
    const arrowNavigation = (direction: number) => {
      const focusedBlock = document.activeElement as HTMLInputElement | null;
      if (!focusedBlock) return;
      const blockArrayT = Array.from(pageRefEl.children) as HTMLInputElement[];

      const nextIndex = focusedBlockIndex + direction;
      if (nextIndex < 0) return;
      else if (nextIndex >= blockArray.length) {
        createBlock();
      } else {
        const textbox = blockArrayT[nextIndex].querySelector("input");
        if (!textbox) return;

        textbox.focus();
      }
    };

    const deleteBlock = () => {
      const focusedBlock = document.activeElement as HTMLInputElement | null;
      if (!focusedBlock) return;

      const pageChildArray = Array.from(
        pageRefEl.children
      ) as HTMLInputElement[];

      //indirectly accessing blockArray as blockArray is intended to be read-only
      const blockArrayRef = [...blockArray];

      //This is because the actual effect of "Backspace" only takes affect after the block is deleted, deleting a character from the block before it.
      blockArrayRef[focusedBlockIndex - 1].content += " ";
      blockArrayRef.splice(focusedBlockIndex, 1);
      setBlockArray([...blockArrayRef]);
      pageChildArray[focusedBlockIndex - 1].querySelector("input")?.focus();
    };

    const keyPressEvent = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          arrowNavigation(-1);
          break;
        case "ArrowDown":
          arrowNavigation(1);
          break;
        case "Backspace":
          if (blockArray[focusedBlockIndex].content === "") {
            deleteBlock();
          }
          break;
      }
    };

    pageRefEl.addEventListener("keydown", keyPressEvent);

    return () => {
      pageRefEl.removeEventListener("keydown", keyPressEvent);
    };
  }, [blockArray, focusedBlockIndex, props.id]);

  return (
    <div className="flex h-full w-full flex-col p-3">
      {
        //impl later
      }
      <button onClick={() => {}}>Submit changes to server</button>
      <input
        className="bg-inherit text-4xl"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />

      <div className="flex w-full flex-col" ref={pageRef}>
        {blockArray.map((block, index) => (
          <Block
            setFocusedBlockIndex={setFocusedBlockIndex}
            key={index}
            block={block}
            index={index}
            setBlockArray={setBlockArray}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
