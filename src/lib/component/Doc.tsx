import React, { useRef, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";
import { VFile } from "vfile/lib";

const Doc = ({ file }: { file: VFile }) => {
  const [title, setTitle] = useState(file.dirname);
  const initialValue = useRef(file.result as Descendant[]);

  const [editor] = useState(() => withReact(createEditor()));

  const saveDoc = () => {};
  const renderElement = (props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading_one":
        return (
          <h1 className="text-4xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  };

  return (
    <div className="flex h-max w-full flex-col bg-inherit p-3">
      <div>
        <input
          className="bg-inherit text-4xl"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <button onClick={saveDoc}>save</button>
      </div>

      <div className="flex h-full w-full flex-col">
        {initialValue ? (
          <Slate editor={editor} value={initialValue.current}>
            <Editable renderElement={renderElement} />
          </Slate>
        ) : (
          <div>lul</div>
        )}
      </div>
    </div>
  );
};

export default Doc;
