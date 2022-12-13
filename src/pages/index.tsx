import { useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import Doc from "../lib/component/Doc";
import { DocWithContent } from "../lib/util/types";

const Home = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocWithContent | null>(null);

  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar setSelectedDoc={setSelectedDoc} />

      {selectedDoc ? (
        //spread opeartor gives error for some reason
        <Doc {...selectedDoc} />
      ) : (
        <div className="flex w-full">no document</div>
      )}
    </div>
  );
};

export default Home;
