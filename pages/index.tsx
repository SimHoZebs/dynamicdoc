import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../component/Sidebar";
import { useStoreState } from "../lib/util/globalStates";
import Document from "../component/Document";
import { Document as IDocument } from "../lib/types";

const Home: NextPage = () => {
  const documentArray = useStoreState((state) => state.documentArray);
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );

  return (
    <div className="flex h-screen bg-dark-800 w-screen text-gray-200">
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
