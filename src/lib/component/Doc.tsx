import React, { useState } from "react";
import { DocWithContent } from "../util/types";
import Editor from "./Editor";

const Doc = (docProps: DocWithContent) => {
  const [title, setTitle] = useState(docProps.title);

  return (
    <div className="flex h-max w-full flex-col bg-inherit p-3">
      <div>
        <input
          className="bg-inherit text-4xl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex h-full w-full flex-col">
        <Editor {...docProps} />
      </div>
    </div>
  );
};

export default Doc;
