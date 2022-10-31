import React from "react";
import { useStoreActions, useStoreState } from "../lib/util/globalStates";
import { Document } from "../lib/types";

interface Props {
  setSelectedDocument: React.Dispatch<React.SetStateAction<Document | null>>;
}

const Sidebar = (props: Props) => {
  const documentArray = useStoreState((state) => state.documentArray);
  const setDocumentArray = useStoreActions(
    (actions) => actions.setDocumentArray
  );

  return (
    <div className="flex flex-col bg-dark-700 min-w-30 p-3 justify-start items-center">
      {documentArray.map((document, index) => (
        <button
          key={index}
          onClick={() => props.setSelectedDocument(() => documentArray[index])}
        >
          {document.title}
        </button>
      ))}

      <button
        className="rounded flex bg-blue-500 text-xs py-1 px-2"
        onClick={() => {
          const newDocument: Document = {
            title: "Untitled document",
            blockArray: [],
          };
          setDocumentArray([...documentArray, newDocument]);
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
