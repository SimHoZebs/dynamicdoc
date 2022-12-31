import React, { useState } from "react";
import { DocWithContent } from "../util/types";
import CustomEditor from "./CustomEditor";

const Doc = (docProps: DocWithContent) => {
  const [title, setTitle] = useState(docProps.title);
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
        <CustomEditor {...docProps} />
      </div>
    </div>
  );
};

export default Doc;
