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
  const initialValue = useRef(docProps.content);
  const [editor, setEditor] = useState(() => withReact(createEditor()));
  const createBlock = trpc.block.create.useMutation();
  const deleteBlock = trpc.block.del.useMutation();

  useEffect(() => {
    const { apply } = editor;

    const syncWithDB = async (type: string) => {
      const newBlock = await createBlock.mutateAsync({
        docId: docProps.id,
        type,
      });

      //In the future, this should be fetched again on reconnect.
      if (!newBlock) {
        console.error(
          "Failed to create new block. The connection to DB might be down or createBlock request is malformed."
        );
        return;
      }

      //sets a property on the node at selection
      Transforms.setNodes(editor, {
        id: newBlock.id,
      });
    };

    editor.apply = (op: BaseOperation) => {
      let newOp: BaseOperation = { ...op };
      //Would use a switch-case, but typescript doesn't seem to be able to narrow the type when I do that.

      if (newOp.type === "move_node") {
        console.log("move_node", newOp);
      } else if (newOp.type === "remove_node") {
        //delete block
        if (typeof newOp.node.id !== "string") {
          console.error("node id is not a string:", newOp.node.id);
          return;
        }
        deleteBlock.mutateAsync(newOp.node.id);
      } else if (newOp.type === "split_node") {
        newOp = {
          ...newOp,
          properties: {
            ...newOp.properties,
            id: null,
            parentId: null,
          },
        };

        if (
          newOp.path.length === 1 &&
          "type" in newOp.properties &&
          typeof newOp.properties.type === "string"
        ) {
          syncWithDB(newOp.properties.type);
        }
      } else if (newOp.type === "insert_node") {
        newOp = {
          ...newOp,
          node: nullify(newOp.node),
        };

        console.log("insert_node", newOp);
      }
      apply(newOp);
    };

    return () => {
      editor.apply = apply;
    };
  }, [createBlock, deleteBlock, docProps.id, editor]);

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
          <Slate editor={editor} value={initialValue.current}>
            <Editable
              renderElement={(renderElementProps) => {
                return <Block {...renderElementProps} />;
              }}
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
