import React, { useEffect, useRef, useState } from "react";
import Block from "./Block";
import { ClientSideBlock, PageWithBlockArray } from "../util/types";
import { trpc } from "../util/trpc";

const Page = (props: PageWithBlockArray) => {
  const [title, setTitle] = useState(props.title);
  const [blockArray, setBlockArray] = useState<ClientSideBlock[]>(
    props.blockArray
  );
  const pageRef = useRef<HTMLDivElement>(null);
  const [focusedBlockIndex, setFocusedBlockIndex] = useState<number>(0);
  const createBlockOnPage = trpc.block.create.useMutation();
  const deleteBlockOnPage = trpc.block.del.useMutation();

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

      createBlockOnPage.mutate({
        type: "text",
        content: "",
        pageId: props.id,
      });
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

    /**
     * Finds the index of the focused block and deletes it from the block array.
     * Deletes the block from the database.
     */
    const deleteBlock = () => {
      if (!document.activeElement || blockArray.length === 0) return;

      const focusedBlock = blockArray[focusedBlockIndex];
      console.log("focused block", focusedBlock);

      if (focusedBlock.content !== "") return;

      //indirectly accessing blockArray as blockArray is intended to be read-only
      const blockArrayRef = [...blockArray];

      //This is because the actual effect of "Backspace" only takes affect after the block is deleted, deleting a character from the next focused block.
      if (focusedBlockIndex !== 0) {
        blockArray[focusedBlockIndex - 1].content += " ";
      } else {
        blockArray[focusedBlockIndex + 1].content += " ";
      }
      blockArrayRef.splice(focusedBlockIndex, 1);
      setBlockArray([...blockArrayRef]);

      if ("id" in focusedBlock) {
        deleteBlockOnPage.mutate(focusedBlock.id);
      } else {
        console.log("block not yet created on server");
      }

      //set focus to the previous block
      if (focusedBlockIndex !== 0) {
        pageRefEl.children[focusedBlockIndex - 1]
          .querySelector("input")
          ?.focus();
      }
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
          deleteBlock();
          break;
        case "Enter":
          createBlock();
      }
    };

    const clickEvent = (e: MouseEvent) => {
      if (
        e.target === pageRefEl &&
        (blockArray.length === 0 ||
          blockArray[blockArray.length - 1].content !== "")
      ) {
        createBlock();
      }
    };

    pageRefEl.addEventListener("keydown", keyPressEvent);
    pageRefEl.addEventListener("click", clickEvent);

    return () => {
      pageRefEl.removeEventListener("keydown", keyPressEvent);
      pageRefEl.removeEventListener("click", clickEvent);
    };
  }, [
    blockArray,
    createBlockOnPage,
    deleteBlockOnPage,
    focusedBlockIndex,
    props.id,
  ]);

  return (
    <div className="flex h-full w-full flex-col p-3">
      <input
        className="bg-inherit text-4xl"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />

      <div className="flex h-full w-full flex-col" ref={pageRef}>
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
