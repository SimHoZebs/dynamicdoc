import React from "react";
import { trpc } from "../util/trpc";
import { DocWithContent } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<DocWithContent | null>>;
}

const Sidebar = () => {
  return (
    <div className="flex min-w-[180px] flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Hello</div>
    </div>
  );
};

export default Sidebar;
