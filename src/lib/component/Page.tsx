import React, { useEffect, useRef, useState } from "react";
import Block from "./Block";
import { Doc } from "../util/types";

const Page = (props: Doc) => {
  const [title, setTitle] = useState(props.title);
  const [blockArray, setBlockArray] = useState<string[]>(props.content);
  const [focusedBlockIndex, setFocusedBlockIndex] = useState<number>(-1);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const pageBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blockElArray = pageBodyRef.current?.children;
    if (!blockElArray || blockElArray.length === 0 || focusedBlockIndex < 0)
      return;

    blockElArray[focusedBlockIndex].querySelector("input")?.focus();
  }, [focusedBlockIndex]);

  //BUG: Server does not know the order of the blocks and messes up on next page load.
  const createBlock = async () => {
    const newBlock = "";

    setBlockArray((prev) => {
      const tempBlockArray = [...prev];
      tempBlockArray.splice(focusedBlockIndex + 1, 0, newBlock);
      return tempBlockArray;
    });

    setFocusedBlockIndex((prev) => prev + 1);
  };

  /**
   * Handles arrow key navigation. Selects a child element within page and iterates through them based on arrow key presses.
   */
  const lineNavigation = (direction: number, el: HTMLDivElement) => {
    const nextIndex = focusedBlockIndex + direction;
    if (nextIndex < 0) return;
    else if (nextIndex >= blockArray.length) {
      createBlock();
    } else {
      const inputEl = el.children[nextIndex].querySelector("input");
      if (!inputEl) return;

      setFocusedBlockIndex(nextIndex);
      inputEl.setSelectionRange(caretPosition, caretPosition);
    }
  };

  /**
   * Finds the index of the focused block and deletes it from the block array.
   * Deletes the block from the database.
   * TODO: Wait until createBlockOnPage is done before deleting the block from the array.
   */
  const deleteBlock = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedBlock = blockArray[focusedBlockIndex];

    if (focusedBlock !== "") return;

    e.preventDefault();

    setBlockArray((prev) => {
      prev.splice(focusedBlockIndex, 1);
      return prev;
    });

    setFocusedBlockIndex((prev) => prev - 1);
  };

  const keyPressEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    //For some reason, the keypress event's default behavior triggers after running the function, requiring most of them to be negated.
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        lineNavigation(-1, el);
        break;

      case "ArrowDown":
        e.preventDefault();
        lineNavigation(1, el);
        break;

      case "ArrowLeft":
        setCaretPosition((prev) => (prev === 0 ? 0 : prev - 1));
        break;

      case "ArrowRight":
        setCaretPosition((prev) =>
          prev === (e.target as HTMLInputElement).value.length ? prev : prev + 1
        );
        break;

      case "Backspace":
        deleteBlock(e);
        break;

      case "Enter":
        createBlock();
    }
  };

  const clickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      blockArray.length === 0 ||
      (!(e.target instanceof HTMLInputElement) &&
        blockArray[blockArray.length - 1] !== "")
    ) {
      createBlock();
    }
  };

  return (
    <div className="flex h-full w-full flex-col p-3">
      <input
        className="bg-inherit text-4xl"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
      />

      <div
        className="flex h-full w-full flex-col"
        onKeyDown={keyPressEvent}
        onClick={clickEvent}
        ref={pageBodyRef}
      >
        {blockArray.map((content, index) => (
          <Block
            setBlockArray={setBlockArray}
            setCaretPosition={setCaretPosition}
            setFocusedBlockIndex={setFocusedBlockIndex}
            key={index}
            content={content}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
