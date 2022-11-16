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
      const focusedBlock = document.activeElement as HTMLInputElement | null;
      if (!focusedBlock) return;

      const blockArray = Array.from(pageRefEl.children) as HTMLInputElement[];
      const currentIndex = blockArray.indexOf(focusedBlock);
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const map = { ArrowUp: -1, ArrowDown: 1 };

        const focusedBlock = document.activeElement as HTMLInputElement | null;
        if (!focusedBlock) return;

        const nextIndex = currentIndex + map[e.key];

        if (nextIndex < 0) return;
        else if (nextIndex >= blockArray.length) {
          createBlock(e);
        }
        blockArray[currentIndex + map[e.key]].focus();
      } else if (e.key === "Backspace") {
        if (blockArray[currentIndex].value === "") {
          setBlockArray((prev) => {
            prev.splice(currentIndex, 1);
            return [...prev];
          });
        }
      }
    };

    const keyPressEvent = (e: KeyboardEvent) => {
      createBlock(e);
      arrowNavigation(e);
    };

    pageRefEl.addEventListener("keydown", keyPressEvent);
    pageRefEl.addEventListener("click", createBlock);

    return () => {
      pageRefEl.removeEventListener("keydown", keyPressEvent);
      pageRefEl.removeEventListener("click", createBlock);
    };
  }, [blockArray.length, props.id]);

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
