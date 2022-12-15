import React, { useEffect, useRef, useState } from "react";
import { createEditor, Editor, Transforms, Node, BaseOperation } from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import {
  ClientSideChildBlock,
  DocWithContent,
  ParentBlockWithChildren,
} from "../util/types";
import Block from "./Block";
import { trpc } from "../util/trpc";

const nullify = (node: Node) => {
  let nullifiedNode = {
    ...node,
  } as ParentBlockWithChildren | ClientSideChildBlock;

  nullifiedNode.id = null;

  if ("parentId" in nullifiedNode) {
    nullifiedNode.prevChildId = null;
    nullifiedNode.parentId = null;
  }

  if ("children" in nullifiedNode && nullifiedNode.children.length !== 0) {
    nullifiedNode.children = nullifiedNode.children.map(
      (child) => nullify(child) as ClientSideChildBlock
    );
    return nullifiedNode;
  } else {
    return nullifiedNode;
  }
};

const Doc = (docProps: DocWithContent) => {
  const [title, setTitle] = useState(docProps.title);
  const initialValue = useRef([
    ...docProps.content,
    // { type: "paragraph", children: [{ text: "" }] },
  ]);
  const updateDoc = trpc.doc.updateBlockOrder.useMutation();
  const [editor, setEditor] = useState(() => withReact(createEditor()));
  const [lineLength, setLineLength] = useState(editor.children.length);

  //Change this to somethign that would only run once. It's duplicating on every hot reload.
  useEffect(() => {
    console.log("editor change");
    const { apply } = editor;

    editor.apply = (op: BaseOperation) => {
      let newOp = { ...op };

      if (newOp.type === "split_node") {
        newOp = {
          ...newOp,
          properties: { ...newOp.properties, id: null },
        };

        console.log("split_node", newOp);
      } else if (newOp.type === "insert_node") {
        newOp = {
          ...newOp,
          node: nullify(newOp.node),
        };

        console.log("insert_node", newOp);
      }
      apply(newOp);
    };
  }, [editor]);

  const saveDoc = () => {
    //infer the block order from the slate AST and save it to the database
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
          <Slate
            editor={editor}
            value={initialValue.current}
            onChange={(what) => {}}
          >
            <Editable
              renderElement={(renderElementProps) => {
                return <Block {...renderElementProps} />;
              }}
              renderLeaf={renderLeaf}
              onKeyUp={(event) => {
                if (lineLength > editor.children.length) {
                  //create block
                } else if (lineLength < editor.children.length) {
                  //delete block
                }
                setLineLength(editor.children.length);
              }}
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
