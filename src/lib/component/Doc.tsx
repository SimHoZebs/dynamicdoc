import React, { useEffect, useRef, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import Property from "./Property";
import { DocWithContent } from "../util/types";
import Block from "./Block";
import { trpc } from "../util/trpc";

const Doc = (props: DocWithContent) => {
  const [title, setTitle] = useState(props.title);
  const initialValue = useRef(props.content);
  const updateDoc = trpc.doc.updateBlockOrder.useMutation();
  const [editor] = useState(() => withReact(createEditor()));
  const [lineLength, setLineLength] = useState(editor.children.length);

  useEffect(() => {
    //when editor creates a new line, add a new block to the database
  }, [lineLength]);

  const saveDoc = () => {
    //infer the block order from the slate AST and save it to the database
  };

  const renderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading_one":
        return (
          <Block attributes={props.attributes}>
            <h1 className="text-4xl">{props.children}</h1>
          </Block>
        );
      case "heading_two":
        return (
          <Block attributes={props.attributes}>
            <h2 className="text-3xl">{props.children}</h2>
          </Block>
        );
      case "heading_three":
        return (
          <Block attributes={props.attributes}>
            <h3 className="text-2xl">{props.children}</h3>
          </Block>
        );
      case "heading_four":
        return (
          <Block attributes={props.attributes}>
            <h4 className="text-xl" {...props.attributes}>
              {props.children}
            </h4>
          </Block>
        );
      case "heading_five":
        return (
          <Block attributes={props.attributes}>
            <h5 className="text-lg">{props.children}</h5>
          </Block>
        );
      case "heading_six":
        return (
          <Block attributes={props.attributes}>
            <h6 className="text-base">{props.children}</h6>
          </Block>
        );
      case "property":
        return <Property {...props} />;

      default:
        return (
          <Block attributes={props.attributes}>
            <div>{props.children}</div>
          </Block>
        );
    }
  };

  const renderLeaf = (props: RenderLeafProps) => {
    return (
      <span
        {...props.attributes}
        className={`${
          props.leaf.special === "italic"
            ? "italic"
            : props.leaf.special === "bold"
            ? "font-bold"
            : ""
        }`}
      >
        {props.children}
      </span>
    );
  };

  return (
    <div className="flex h-max w-full flex-col bg-inherit p-3">
      <div>
        <input
          className="bg-inherit text-4xl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={saveDoc}>save</button>
      </div>

      <div className="flex h-full w-full flex-col">
        {initialValue ? (
          //childBlock being nullish is the issue here
          <Slate editor={editor} value={initialValue.current}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={(event) => {
                if (event.key === "/" && event.ctrlKey) {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: (node) =>
                      Editor.isBlock(editor, node) && node.type === "property",
                  });
                  Transforms.setNodes(
                    editor,
                    { type: match ? "paragraph" : "property" },
                    { match: (node) => Editor.isBlock(editor, node) }
                  );
                }
              }}
            />
          </Slate>
        ) : (
          <div>lul</div>
        )}
      </div>
    </div>
  );
};

export default Doc;
