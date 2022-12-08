import React, { useEffect, useRef, useState } from "react";
import Line from "./Line";
import { Doc } from "../util/types";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";

const Doc = (props: Doc) => {
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState<string[]>(props.content);
  const [focusedLineIndex, setFocusedLineIndex] = useState<number>(-1);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const saveDoc = () => {
    console.log("saving Doc");
    writeTextFile("Basalt/" + props.title, content.join("\n"), {
      dir: BaseDirectory.Data,
    });
  };

  useEffect(() => {
    const contentEl = contentWrapperRef.current?.children;
    if (!contentEl || contentEl.length === 0 || focusedLineIndex < 0) return;

    contentEl[focusedLineIndex].querySelector("input")?.focus();

    contentEl[focusedLineIndex]
      .querySelector("input")
      ?.setSelectionRange(caretPosition, caretPosition);
  }, [focusedLineIndex, caretPosition]);

  const createLine = async () => {
    setContent((prev) => {
      const contentCopy = [...prev];
      const currentLine = contentCopy[focusedLineIndex];
      const newLine = currentLine.slice(caretPosition);
      contentCopy[focusedLineIndex] = currentLine.slice(0, caretPosition);
      contentCopy.splice(focusedLineIndex + 1, 0, newLine);
      return contentCopy;
    });

    setFocusedLineIndex((prev) => prev + 1);
    setCaretPosition(0);
  };

  /**
   * Handles arrow key navigation. Selects a child element within page and iterates through them based on arrow key presses.
   */
  const lineNavigation = (
    direction: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const el = e.currentTarget;
    const nextIndex = focusedLineIndex + direction;
    if (nextIndex < 0) return;
    else if (nextIndex >= content.length) {
      createLine();
    } else {
      const inputEl = el.children[nextIndex].querySelector("input");
      if (!inputEl) return;

      setFocusedLineIndex(nextIndex);
      const nextLineLength = content[focusedLineIndex + direction].length;
      setCaretPosition((curr) =>
        nextLineLength < curr ? nextLineLength : curr
      );
    }
  };

  const deleteLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (caretPosition !== 0) return;
    e.preventDefault();

    setContent((prev) => {
      const contentCopy = [...prev];
      const deletedLine = contentCopy.splice(focusedLineIndex, 1);
      contentCopy[contentCopy.length - 1] += deletedLine[0];
      return contentCopy;
    });

    setFocusedLineIndex((prev) => prev - 1);
    setCaretPosition(content[focusedLineIndex - 1].length);
  };
  const keyPressEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowUp":
        lineNavigation(-1, e);
        break;

      case "ArrowDown":
        lineNavigation(1, e);
        break;

      case "ArrowLeft":
        e.preventDefault();
        setCaretPosition((prev) => (prev === 0 ? 0 : prev - 1));
        break;

      case "ArrowRight":
        e.preventDefault();
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
      <div>
        <input
          className="bg-inherit text-4xl"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <button onClick={saveDoc}>save</button>
      </div>

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
