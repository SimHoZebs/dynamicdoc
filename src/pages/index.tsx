import Sidebar from "../lib/component/Sidebar";
import Editor from "../lib/component/Editor";

const Home = () => {
  return (
    <div className="flex w-full">
      <Sidebar />

      <div className="flex h-full w-full max-w-3xl flex-col bg-inherit p-4">
        <Editor />
      </div>
    </div>
  );
};

export default Home;
