import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import { useStoreState } from "../lib/util/globalStates";
import Document from "../lib/component/Document";
import { Page as IPage } from "../lib/util/types";

const Home: NextPage = () => {
  const documentArray = useStoreState((state) => state.documentArray);
  const [selectedDocument, setSelectedDocument] = useState<IPage | null>(null);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-gray-200">
      <Sidebar setSelectedDocument={setSelectedDocument} />

      {selectedDocument ? (
        <Document
          blockArray={selectedDocument.blockArray}
          title={selectedDocument.title}
        />
      ) : (
        <div className="p-3">no document</div>
      )}
    </div>
  );
};

export default Home;
