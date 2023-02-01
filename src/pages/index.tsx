import Sidebar from "../lib/component/Sidebar";
import Doc from "../lib/component/Doc";

const Home = () => {
  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar />

      <Doc />
    </div>
  );
};

export default Home;
