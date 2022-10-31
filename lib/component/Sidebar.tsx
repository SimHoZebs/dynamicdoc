import React from "react";
import { useStoreActions, useStoreState } from "../util/globalStates";
import { Page } from "../util/types";

interface Props {
  setSelectedDocument: React.Dispatch<React.SetStateAction<Page | null>>;
}

const Sidebar = (props: Props) => {
  const documentArray = useStoreState((state) => state.documentArray);
  const setDocumentArray = useStoreActions(
    (actions) => actions.setDocumentArray
  );

  return (
    <div className="bg-dark-700 min-w-30 flex flex-col items-center justify-start p-3">
      {documentArray.map((document, index) => (
        <button
          key={index}
          onClick={() => props.setSelectedDocument(() => documentArray[index])}
        >
          {document.title}
        </button>
      ))}

      <button
        className="flex rounded bg-blue-300 py-1 px-2 text-xs"
        onClick={() => {
          //Need to auto generate id
          const newDocument: Page = {
            id: 0,
            title: "Untitled document",
            authorId: 0,
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
