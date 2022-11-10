import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import createPage from "../api/createPage";
import { getAllPages } from "../api/getAllPages";
import getPage from "../api/getPage";
import { useStoreActions, useStoreState } from "../util/globalStates";
import { PageWithBlockArray } from "../util/types";

interface Props {
  setSelectedPage: React.Dispatch<
    React.SetStateAction<PageWithBlockArray | null>
  >;
  user: User | null;
}

const Sidebar = (props: Props) => {
  const user = useStoreState((state) => state.user);
  const setUser = useStoreActions((actions) => actions.setUser);
  const pageArray = useStoreState((state) => state.pageArray);
  const setPageArray = useStoreActions((actions) => actions.setPageArray);
  const router = useRouter();

  useEffect(() => {
    async function test() {
      const user = props.user;
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);

      const pageArray = await getAllPages(user.id);
      setPageArray(pageArray ? pageArray : []);
    }
    test();
  }, [props.user, router, setPageArray, setUser]);

  return (
    <div className="min-w-30 flex flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Username: {user.name}</div>

      <div className="flex flex-col">
        {pageArray.map((document, index) => (
          <button
            className="rounded p-1 hover:bg-dark-200"
            key={index}
            onClick={async () => {
              const selectedPage = await getPage(document.id, user.id);
              props.setSelectedPage(() => selectedPage);
            }}
          >
            {document.title}
          </button>
        ))}
      </div>

      <button
        className="flex rounded bg-blue-500 py-1 px-2 text-xs"
        onClick={async () => {
          //For now, the client doesn't get a new page until the server responds
          //This is because the client doesn't know the id of the new page
          //Creating a new page without id will require a way for id-less pages and id-ed pages to coexist
          //or a way to update the id of the page after the server responds
          //The page should do nothing regarding its id until then.
          const newPage = await createPage("Untitled document", user.id);
          setPageArray([...pageArray, newPage]);
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
