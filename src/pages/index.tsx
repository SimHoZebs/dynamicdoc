import Sidebar from "../lib/component/Sidebar";
import Editor from "../lib/component/Editor";

const Home = () => {
  return (
    <div className="flex w-full">
      <Sidebar />

      <div className="flex h-full w-full flex-col bg-inherit">
        <Editor />
      </div>
    </div>
  );
};

export default Home;
