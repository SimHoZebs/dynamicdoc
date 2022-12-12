import React from "react";
import remarkParse from "remark-parse";
import remarkSlate from "remark-slate";
import { unified } from "unified";
import { trpc } from "../util/trpc";
import { PageWithBlocks } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<PageWithBlocks | null>>;
}

const Sidebar = (props: Props) => {
  const getPageArray = trpc.page.getAll.useQuery();
  const createDoc = trpc.page.create.useMutation();
  const util = trpc.useContext();

  const convertFile = async (content: string) => {
    return unified().use(remarkParse).use(remarkSlate).process(content);
  };

  return (
    <div className="flex min-w-[180px] flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Hello</div>

      <div className="flex flex-col">
        {getPageArray.data
          ? getPageArray.data.map((doc, index) => (
              <button
                className="rounded p-1 hover:bg-dark-200"
                key={index}
                onClick={async () => {
                  const selectedDoc = await util.page.get.fetch({ id: doc.id });
                  props.setSelectedDoc(selectedDoc);
                }}
              >
                {doc.title}
              </button>
            ))
          : null}
      </div>

      <button
        className="flex rounded bg-blue-500 py-1 px-2 text-xs"
        onClick={async () => {
          await createDoc.mutateAsync({
            title: "New document",
            blockOrder: "",
          });
          getPageArray.refetch();
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
