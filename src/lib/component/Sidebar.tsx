import React from "react";
import { trpc } from "../util/trpc";
import { DocWithContent } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<DocWithContent | null>>;
}

const Sidebar = (props: Props) => {
  const getPageArray = trpc.doc.getAll.useQuery();
  const createDoc = trpc.doc.create.useMutation();
  const createBlock = trpc.block.create.useMutation();
  const query = trpc.useContext();

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
                  const docBlockArray = await query.block.getAll.fetch(doc.id);
                  if (docBlockArray.length === 0) {
                    const newBlock = await createBlock.mutateAsync({
                      docId: doc.id,
                      type: "paragraph",
                    });
                    if (!newBlock) return;

                    docBlockArray.push(newBlock);
                  }

                  props.setSelectedDoc({ ...doc, content: docBlockArray });
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
            blockOrder: [],
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
