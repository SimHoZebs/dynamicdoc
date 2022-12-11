import React, { useRef, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { VFile } from "vfile/lib";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { serialize } from "remark-slate";
import Property from "./Property";

const Doc = ({ file }: { file: VFile }) => {
  const [title, setTitle] = useState(file.basename);
  const initialValue = useRef(file.result as Descendant[]);

  const [editor] = useState(() => withReact(createEditor()));

  const saveDoc = () => {
    const content = editor.children.map((child) => serialize(child)).join("");
    writeTextFile("Basalt/test.md", content, { dir: BaseDirectory.Data });
  };

  const renderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading_one":
        return (
          <h1 className="text-4xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "heading_two":
        return (
          <h2
            className={`text-3xl ${props.element.children}`}
            {...props.attributes}
          >
            {props.children}
          </h2>
        );
      case "heading_three":
        return (
          <h3 className="text-2xl" {...props.attributes}>
            {props.children}
          </h3>
        );
      case "heading_four":
        return (
          <h4 className="text-xl" {...props.attributes}>
            {props.children}
          </h4>
        );
      case "heading_five":
        return (
          <h5 className="text-lg" {...props.attributes}>
            {props.children}
          </h5>
        );
      case "heading_six":
        return (
          <h6 className="text-base" {...props.attributes}>
            {props.children}
          </h6>
        );
      case "property":
        return <Property {...props} />;

      default:
        return <div {...props.attributes}>{props.children}</div>;
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
        <input className="bg-inherit text-4xl" value={title} />
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
                    match: (node) => node.type === "property",
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
