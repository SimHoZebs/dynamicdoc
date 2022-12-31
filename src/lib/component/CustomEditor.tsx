import React, { useEffect, useRef, useState } from "react";
import {
  createEditor,
  Transforms,
  Node,
  BaseOperation,
  Editor,
  Path,
} from "slate";
import { Slate, Editable, withReact } from "slate-react";
import {
  ClientSideChildBlock,
  DocWithContent,
  ParentBlockWithChildren,
} from "../util/types";
import Block from "./Block";
import { trpc } from "../util/trpc";
import Leaf from "./Leaf";

const nullifiedNode = (node: Node) => {
  let targetNode = {
    ...node,
  } as ParentBlockWithChildren | ClientSideChildBlock;

  targetNode.id = null;

  if ("parentId" in targetNode) {
    targetNode.prevChildId = null;
    targetNode.parentId = null;
  }

  if (targetNode.children && targetNode.children.length !== 0) {
    targetNode.children = targetNode.children.map(
      (child) => nullifiedNode(child) as ClientSideChildBlock
    );
    return targetNode;
  } else {
    return targetNode;
  }
};

const CustomEditor = (docProps: DocWithContent) => {
  const initialValue = useRef(docProps.content);
  const [editor] = useState(() => withReact(createEditor()));
  const createBlock = trpc.block.create.useMutation();
  const deleteBlock = trpc.block.del.useMutation();
  const [lastOperation, setLastOperation] = useState<BaseOperation["type"]>();

  useEffect(() => {
    const { apply } = editor;

    const syncWithDB = async (type: string, path: Path) => {
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

      Transforms.setNodes(editor, { id: newBlock.id }, { at: path });
    };

    editor.apply = (op: BaseOperation) => {
      let newOp: BaseOperation = { ...op };
      console.log(newOp.type, newOp);
      switch (newOp.type) {
        case "insert_text": {
          const parentBlock = editor.children[newOp.path[0]];
          if (!parentBlock.id || !("children" in parentBlock)) return;

          const fragment: ClientSideChildBlock = {
            parentId: parentBlock.id,
            text: "",
            type: null,
            id: null,
            special: "",
            prevChildId: null,
          };

          const currLeafSpecial = Editor.leaf(editor, newOp.path)[0].special;

          switch (newOp.text) {
            //TODO: merge every text in front of it to italics if possible.
            case "*": {
              if (currLeafSpecial === "italic") {
                Transforms.insertFragment(editor, [fragment]);
              } else if (!currLeafSpecial) {
                newOp.text = "";
                fragment.text = "*";
                fragment.special = "italic";
                Transforms.insertFragment(editor, [fragment]);
              }
              break;
            }

            case "{": {
              if (!currLeafSpecial) {
                newOp.text = "";
                fragment.text = null;
                fragment.special = "property";
                fragment.children = [
                  {
                    text: "",
                    parentId: null,
                    prevChildId: null,
                    id: null,
                    type: null,
                    special: null,
                  },
                ];
                Transforms.insertFragment(editor, [fragment]);
              }
              break;
            }

            case "}": {
              if (currLeafSpecial === "property") {
                Transforms.insertFragment(editor, [fragment]);
              }
              break;
            }
          }
          break;
        }

        case "remove_node": {
          //Prevents default behavior of deleting new, empty node.
          if (lastOperation === "insert_text") {
            console.log("Prevented deletion of new node.");
            return;
          }

          //delete block
          //FUTURE: Should check if the node is having an ID generated before deleting or interrupt the node creation.
          if (typeof newOp.node.id !== "string") {
            console.error("node id is not a string:", newOp.node.id);
          } else {
            deleteBlock.mutateAsync(newOp.node.id);
          }
          break;
        }

        case "split_node": {
          newOp = {
            ...newOp,
            properties: {
              ...newOp.properties,
              id: undefined,
              parentId: null,
            },
          };

          if (
            newOp.path.length === 1 &&
            "type" in newOp.properties &&
            typeof newOp.properties.type === "string"
          ) {
            syncWithDB(newOp.properties.type, newOp.path);
          }
          break;
        }

        case "insert_node": {
          newOp = {
            ...newOp,
            node: nullifiedNode(newOp.node),
          };
          break;
        }
      }

      apply(newOp);
      setLastOperation(newOp.type);
    };

    return () => {
      editor.apply = apply;
    };
  }, [createBlock, deleteBlock, docProps.id, editor, lastOperation]);

  return (
    <Slate editor={editor} value={initialValue.current}>
      <Editable
        renderElement={(props) => {
          return <Block {...props} />;
        }}
        renderLeaf={(props) => {
          return <Leaf {...props} />;
        }}
      />
    </Slate>
  );
};

export default CustomEditor;
