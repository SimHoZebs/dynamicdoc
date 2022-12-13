import { Doc } from "@prisma/client";
import React, { useState } from "react";
import remarkParse from "remark-parse";
import remarkSlate from "remark-slate";
import { unified } from "unified";
import block from "../function/block";
import doc from "../function/doc";
import { CustomElement, DocWithContent } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<DocWithContent | null>>;
}

const Sidebar = (props: Props) => {
  const [pageArray, setPageArray] = useState<Doc[]>();

  const convertFile = async (content: string) => {
    return unified().use(remarkParse).use(remarkSlate).process(content);
  };

  return (
    <div className="flex min-w-[180px] flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Hello</div>

      <div className="flex flex-col">
        {pageArray
          ? pageArray.map((doc, index) => (
              <button
                className="rounded p-1 hover:bg-dark-200"
                key={index}
                onClick={async () => {
                  const docBlockArray = await block.getAll(doc.id);
                  const slateAST = await convertFile(docBlockArray.join("\n"));
                  if ((slateAST.result as CustomElement[]).length === 0) {
                    slateAST.result = [
                      {
                        type: "paragraph",
                        children: [{ text: "" }],
                      },
                    ];
                  }
                  console.log(slateAST);

                  props.setSelectedDoc({
                    ...doc,
                    slateAST,
                  });
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
          await doc.create("New document", "");
          const pageArray = await doc.getAll();
          setPageArray(pageArray);
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
