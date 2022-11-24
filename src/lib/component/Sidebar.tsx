import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useStoreActions, useStoreState } from "../util/globalStates";
import { trpc } from "../util/trpc";
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
  const router = useRouter();
  const createPage = trpc.page.create.useMutation();
  const util = trpc.useContext();
  const { data: pageArray, refetch: refetchPageArray } =
    trpc.page.getAll.useQuery(user.id);

  useEffect(() => {
    async function test() {
      const user = props.user;
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
    }
    test();
  }, [props.user, router, setUser]);

  return (
    <div className="flex min-w-[180px] flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Username: {user.name}</div>

      <div className="flex flex-col">
        {pageArray
          ? pageArray.map((document, index) => (
              <button
                className="rounded p-1 hover:bg-dark-200"
                key={index}
                onClick={async () => {
                  const selectedPage = await util.page.get.fetch({
                    id: document.id,
                    authorId: user.id,
                  });

                  if (selectedPage) {
                    props.setSelectedPage(selectedPage);
                  }
                }}
              >
                {document.title}
              </button>
            ))
          : null}
      </div>

      <button
        className="flex rounded bg-blue-500 py-1 px-2 text-xs"
        onClick={() => {
          createPage.mutate({
            title: "Untitled document",
            authorId: user.id,
          });
          refetchPageArray();
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
