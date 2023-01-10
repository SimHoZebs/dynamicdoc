import React, { useEffect, useRef, useState } from "react";
import {
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $insertNodes,
  EditorState,
  ParagraphNode,
  TextNode,
} from "lexical";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TRANSFORMERS } from "@lexical/markdown";

import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";

import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { DocWithContent } from "../util/types";
import { $createPropertiesNode, PropertiesNode } from "./CustomTextNode";
import Autocomplete from "./Autocomplete";

const theme = {
  // Theme styling goes here
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyTestPlugin(props: {
  setNodePos: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const textNodeTransform = (textNode: TextNode) => {
      const textContent = textNode.getTextContent();
      console.log("text content", textContent);

      if (textContent.includes("{")) {
        editor.update(() => {
          textNode.setTextContent(textContent.replace("{", ""));
          const propertiesNode = $createPropertiesNode("{");
          $insertNodes([propertiesNode]);
        });
      }
    };

    //Gives position for Autocomplete component to attach to.
    //TODO: This only gives position when something after { is typed. Make it so that it gives position the moment it is created.
    const PropertiesNodeTransform = (coloredNode: PropertiesNode) => {
      //TODO: if } is typed, a text node has to be inserted next
      const el = editor.getElementByKey(coloredNode.__key);
      if (!el) return;
      const { x, y } = el.getBoundingClientRect();

      console.log("getBoudingClientRec", el?.getBoundingClientRect());

      props.setNodePos([x, y]);
    };

    const removeTextNodeTransform = editor.registerNodeTransform(
      TextNode,
      textNodeTransform
    );
    const removePropertiesNodeTransform = editor.registerNodeTransform(
      PropertiesNode,
      PropertiesNodeTransform
    );

    return () => {
      removeTextNodeTransform();
      removePropertiesNodeTransform();
    };
  }, [editor, props]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function Editor(props: DocWithContent) {
  const [nodePos, setNodePos] = useState<number[]>([]);

  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ParagraphNode,
      PropertiesNode,
    ],
    editorState: JSON.stringify({
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "Hello World",
                type: "text",
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        type: "root",
        indent: 0,
        format: "",
        direction: null,
        version: 1,
      },
    }),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SavePlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
      <LinkPlugin />
      <HistoryPlugin />
      <MyTestPlugin setNodePos={setNodePos} />
      <Autocomplete nodePos={nodePos} />
      {/* <OnChangePlugin onChange={(editorState) => console.log(editorState)} /> */}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </LexicalComposer>
  );
}

export default Editor;

const SavePlugin = () => {
  const [editor] = useLexicalComposerContext();
  // editor.toJSON();
  return (
    <button className="bg-blue-400 font-semibold text-dark-400">Save</button>
  );
};
