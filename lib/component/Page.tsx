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
    const createBlock = async (e: KeyboardEvent | MouseEvent) => {
      console.log("creating new block");

      if (
        ("key" in e && e.key === "Enter") ||
        (e.type === "click" && e.target === e.currentTarget)
      ) {
        const newBlock: ClientSideBlock = {
          type: "",
          content: "",
          pageId: props.id,
        };

        setBlockArray((prev) => {
          return [...prev, newBlock];
        });

        addBlockToPage("", props.id);
      }
    };

    /**
     * Handles arrow key navigation. Selects a child element within page and iterates through them based on arrow key presses.
     * @param e
     * @returns
     */
    const arrowNavigation = (e: KeyboardEvent) => {
      // const focusedBlock = document.activeElement as HTMLInputElement | null;
      // if (!focusedBlock) return;
      // const blockArray = Array.from(pageRefEl.children) as HTMLInputElement[];
      // const currentIndex = blockArray.indexOf(focusedBlock);
      // if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      //   const map = { ArrowUp: -1, ArrowDown: 1 };
      //   const focusedBlock = document.activeElement as HTMLInputElement | null;
      //   if (!focusedBlock) return;
      //   const nextIndex = currentIndex + map[e.key];
      //   if (nextIndex < 0) return;
      //   else if (nextIndex >= blockArray.length) {
      //     createBlock(e);
      //   }
      //   blockArray[currentIndex + map[e.key]].focus();
      // }
    };

    const deleteBlock = () => {
      const focusedBlock = document.activeElement as HTMLInputElement | null;
      if (!focusedBlock) return;

      const pageChildArray = Array.from(
        pageRefEl.children
      ) as HTMLInputElement[];

      const yeet = [...blockArray];
      yeet.splice(focusedBlockIndex, 1);
      setBlockArray([...yeet]);
      pageChildArray[focusedBlockIndex - 1].querySelector("input")?.focus();
    };

    const keyPressEvent = (e: KeyboardEvent) => {
      arrowNavigation(e);
      if (
        e.key === "Backspace" &&
        blockArray[focusedBlockIndex].content === ""
      ) {
        deleteBlock();
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
