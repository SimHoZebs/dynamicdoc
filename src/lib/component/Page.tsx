import React, { useState } from "react";
import Block from "./Block";
import { ClientSideBlock, PageWithBlockArray } from "../util/types";
import { trpc } from "../util/trpc";

const Page = (props: PageWithBlockArray) => {
  const [title, setTitle] = useState(props.title);
  const [blockArray, setBlockArray] = useState<ClientSideBlock[]>(
    props.blockArray
  );
  const [focusedBlockIndex, setFocusedBlockIndex] = useState<number>(0);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const createBlockOnPage = trpc.block.create.useMutation();
  const deleteBlockOnPage = trpc.block.del.useMutation();

  const createBlock = async () => {
    const newBlock: ClientSideBlock = {
      type: "",
      content: "",
      pageId: props.id,
    };

    setBlockArray((prev) => {
      return [...prev, newBlock];
    });

    const createdBlock = await createBlockOnPage.mutateAsync({
      type: "text",
      content: "",
      pageId: props.id,
    });

    setBlockArray((prev) => {
      prev[prev.length - 1] = createdBlock;
      return prev;
    });
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

      inputEl.focus();
      inputEl.setSelectionRange(caretPosition, caretPosition);
    }
  };

  /**
   * Finds the index of the focused block and deletes it from the block array.
   * Deletes the block from the database.
   */
  const deleteBlock = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedBlock = blockArray[focusedBlockIndex];

    if (focusedBlock.content !== "") return;

    e.preventDefault();

    setBlockArray((prev) => {
      prev.splice(focusedBlockIndex, 1);
      return prev;
    });

    //set focus to the previous block
    if (focusedBlockIndex !== 0) {
      e.currentTarget.children[focusedBlockIndex - 1]
        .querySelector("input")
        ?.focus();
    }

    if ("id" in focusedBlock) {
      deleteBlockOnPage.mutate(focusedBlock.id);
    } else {
      console.log("block not yet created on server");
    }
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
      !(e.target instanceof HTMLInputElement) &&
      blockArray[blockArray.length - 1].content !== ""
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
      >
        {blockArray.map((block, index) => (
          <Block
            setCaretPosition={setCaretPosition}
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
