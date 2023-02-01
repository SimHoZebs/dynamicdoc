import Sidebar from "../lib/component/Sidebar";
import Doc from "../lib/component/Doc";

const Home = () => {
  return (
    <div className="flex w-full">
      <Sidebar />

      <Doc />
    </div>
  );
};

export default Home;
