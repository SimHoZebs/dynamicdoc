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

  if ("children" in targetNode && targetNode.children.length !== 0) {
    targetNode.children = targetNode.children.map(
      (child) => nullifiedNode(child) as ClientSideChildBlock
    );
    return targetNode;
  } else {
    return targetNode;
  }
};

const Doc = (docProps: DocWithContent) => {
  const [title, setTitle] = useState(docProps.title);
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

          const fragment = {
            parentId: parentBlock.id,
            text: "",
            type: null,
            id: null,
            special: "",
            prevChildId: null,
          };

          const currLeafSpecial = Editor.leaf(editor, newOp.path)[0].special;

          switch (newOp.text) {
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
                fragment.text = "{";
                fragment.special = "property";
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
              id: null,
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

  const saveDoc = () => {
    //infer the block order from the slate AST and save it to the database
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
      </div>
    </div>
  );
};

export default Doc;
