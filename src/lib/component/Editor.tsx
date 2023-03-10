import React from "react";
import { $createParagraphNode, $createTextNode, ParagraphNode } from "lexical";
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
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import TreeViewPlugin from "../plugins/TreeViewPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";

import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";
import GroupPickerMenuPlugin from "../plugins/GroupPickerMenuPlugin";
import { GroupTitleNode } from "./nodes/GroupTitleNode";
import { GroupItemNode } from "./nodes/GroupItemNode";
import GroupPlugin from "../plugins/GroupPlugin";

const theme = {
  // Theme styling goes here
  list: {
    listeitem: "my-2 mx-4",
    ul: "p-0 m-0 ml-4 list-disc list-inside",
    olDepth: ["p-0 m-0 ml-4"],
  },
  paragraph: "paragraph",
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function Editor() {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      GroupTitleNode,
      GroupItemNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      HashtagNode,
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
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
      <HistoryPlugin />
      {typeof document !== "undefined" ? <GroupPickerMenuPlugin /> : ""}
      <GroupPlugin />
      <TreeViewPlugin />
      <HashtagPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
    </LexicalComposer>
  );
}

export default Editor;

const SavePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const saveEditor = () => {
    const editorAST = editor.toJSON();
    console.log(editorAST);
  };

  return (
    <button
      className="bg-blue-400 font-semibold text-dark-400"
      onClick={saveEditor}
    >
      Save
    </button>
  );
};
