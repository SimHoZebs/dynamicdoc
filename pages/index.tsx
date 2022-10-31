import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import { useStoreState } from "../lib/util/globalStates";
import Page from "../lib/component/Page";
import { PageWithBlockArray } from "../lib/util/types";

const Home: NextPage = () => {
  const pageArray = useStoreState((state) => state.documentArray);
  const [selectedPage, setSelectedPage] = useState<PageWithBlockArray | null>(
    null
  );

  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar setSelectedDocument={setSelectedPage} />

      {selectedPage ? (
        <Page {...selectedPage} />
      ) : (
        <div className="p-3">no document</div>
      )}
    </div>
  );
};

export default Home;
