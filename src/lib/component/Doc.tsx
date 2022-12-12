import React, { useEffect, useRef, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { serialize } from "remark-slate";
import Property from "./Property";
import { Doc } from "../util/types";
import Line from "./Line";
import { trpc } from "../util/trpc";

const Doc = (props: Doc) => {
  const [title, setTitle] = useState(props.title);
  const initialValue = useRef(props.slateAST.result as Descendant[]);
  const updateDoc = trpc.page.updateBlockOrder.useMutation();
  const [editor] = useState(() => withReact(createEditor()));

  useEffect(() => {
    //when editor creates a new line, add a new block to the database
  }, []);

  const saveDoc = () => {
    //infer the block order from the slate AST and save it to the database
  };

  const renderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading_one":
        return (
          <Line attributes={props.attributes}>
            <h1 className="text-4xl">{props.children}</h1>
          </Line>
        );
      case "heading_two":
        return (
          <Line attributes={props.attributes}>
            <h2 className={`text-3xl ${props.element.children}`}>
              {props.children}
            </h2>
          </Line>
        );
      case "heading_three":
        return (
          <Line attributes={props.attributes}>
            <h3 className="text-2xl">{props.children}</h3>
          </Line>
        );
      case "heading_four":
        return (
          <Line attributes={props.attributes}>
            <h4 className="text-xl" {...props.attributes}>
              {props.children}
            </h4>
          </Line>
        );
      case "heading_five":
        return (
          <Line attributes={props.attributes}>
            <h5 className="text-lg">{props.children}</h5>
          </Line>
        );
      case "heading_six":
        return (
          <Line attributes={props.attributes}>
            <h6 className="text-base">{props.children}</h6>
          </Line>
        );
      case "property":
        return <Property {...props} />;

      default:
        return (
          <Line attributes={props.attributes}>
            <div>{props.children}</div>
          </Line>
        );
    }
  };

  const renderLeaf = (props: RenderLeafProps) => {
    return (
      <p
        {...props.attributes}
        className={`${props.leaf.italic ? "italic" : null} ${
          props.leaf.bold ? "font-bold" : null
        } `}
      >
        {props.children}
      </p>
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
