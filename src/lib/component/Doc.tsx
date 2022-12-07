import React, { useEffect, useRef, useState } from "react";
import Line from "./Line";
import { Doc } from "../util/types";

const Doc = (props: Doc) => {
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState<string[]>(props.content);
  const [focusedLineIndex, setFocusedLineIndex] = useState<number>(-1);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentEl = contentWrapperRef.current?.children;
    if (!contentEl || contentEl.length === 0 || focusedLineIndex < 0) return;

    contentEl[focusedLineIndex].querySelector("input")?.focus();
  }, [focusedLineIndex]);

  //BUG: Server does not know the order of the blocks and messes up on next page load.
  const createLine = async () => {
    const newLine = "";

    setContent((prev) => {
      const newContent = [...prev];
      newContent.splice(focusedLineIndex + 1, 0, newLine);
      return newContent;
    });

    setFocusedLineIndex((prev) => prev + 1);
  };

  /**
   * Handles arrow key navigation. Selects a child element within page and iterates through them based on arrow key presses.
   */
  const lineNavigation = (direction: number, el: HTMLDivElement) => {
    const nextIndex = focusedLineIndex + direction;
    if (nextIndex < 0) return;
    else if (nextIndex >= content.length) {
      createLine();
    } else {
      const inputEl = el.children[nextIndex].querySelector("input");
      if (!inputEl) return;

      setFocusedLineIndex(nextIndex);
      inputEl.setSelectionRange(caretPosition, caretPosition);
    }
  };

  /**
   * Finds the index of the focused block and deletes it from the block array.
   * Deletes the block from the database.
   * TODO: Wait until createBlockOnPage is done before deleting the block from the array.
   */
  const deleteLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedLine = content[focusedLineIndex];

    if (focusedLine !== "") return;

    e.preventDefault();

    setContent((prev) => {
      prev.splice(focusedLineIndex, 1);
      return prev;
    });

    setFocusedLineIndex((prev) => prev - 1);
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
        deleteLine(e);
        break;

      case "Enter":
        createLine();
    }
  };

  const clickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      content.length === 0 ||
      (!(e.target instanceof HTMLInputElement) &&
        content[content.length - 1] !== "")
    ) {
      createLine();
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
        ref={contentWrapperRef}
      >
        {content.map((line, index) => (
          <Line
            setContent={setContent}
            setCaretPosition={setCaretPosition}
            setFocusedLineIndex={setFocusedLineIndex}
            key={index}
            line={line}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Doc;
