import React from "react";
import { trpc } from "../util/trpc";
import { DocWithContent } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<DocWithContent | null>>;
}

const Sidebar = () => {
  return (
    <div className="outline-3 flex min-w-[180px] flex-col items-center justify-start gap-y-2 p-4 outline outline-dark-400">
      <div>Hello</div>
    </div>
  );
};

export default Sidebar;
