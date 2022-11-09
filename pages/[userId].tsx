import type { NextPage } from "next";
import { useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import Page from "../lib/component/Page";
import { PageWithBlockArray } from "../lib/util/types";

const Home: NextPage = () => {
  const [selectedPage, setSelectedPage] = useState<PageWithBlockArray | null>(
    null
  );

  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar setSelectedPage={setSelectedPage} />

      {selectedPage ? (
        <Page {...selectedPage} />
      ) : (
        <div className="p-3">no document</div>
      )}
    </div>
  );
};

export default Home;