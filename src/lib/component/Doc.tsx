import React, { useState } from "react";
import Editor from "./Editor";

const Doc = () => {
  return (
    <div className="flex h-full w-full flex-col bg-inherit">
      <Editor />
    </div>
  );
};

export default Doc;
