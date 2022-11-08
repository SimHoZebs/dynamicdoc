import React from "react";
import createNewPage from "../api/createNewPage";
import findPage from "../api/findPage";
import { useStoreActions, useStoreState } from "../util/globalStates";
import { PageWithBlockArray } from "../util/types";

interface Props {
  setSelectedPage: React.Dispatch<
    React.SetStateAction<PageWithBlockArray | null>
  >;
}

const Sidebar = (props: Props) => {
  const user = useStoreState((state) => state.user);
  const pageArray = useStoreState((state) => state.pageArray);
  const setPageArray = useStoreActions((actions) => actions.setPageArray);

  return (
    <div className="min-w-30 flex flex-col items-center justify-start bg-dark-700 p-3">
      {pageArray.map((document, index) => (
        <button
          key={index}
          onClick={async () => {
            const selectedPage = await findPage(document.id);
            props.setSelectedPage(() => selectedPage);
          }}
        >
          {document.title}
        </button>
      ))}
      <button
        className="flex rounded bg-blue-500 py-1 px-2 text-xs"
        onClick={async () => {
          //For now, the client doesn't get a new page until the server responds
          //This is because the client doesn't know the id of the new page
          //Creating a new page without id will require a way for id-less pages and id-ed pages to coexist
          //or a way to update the id of the page after the server responds
          //The page should do nothing regarding its id until then.
          const newPage = await createNewPage("Untitled document", user.id);
          setPageArray([...pageArray, newPage]);
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
