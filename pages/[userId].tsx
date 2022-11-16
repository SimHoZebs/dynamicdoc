import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import Page from "../lib/component/Page";
import { PageWithBlockArray } from "../lib/util/types";
import getUser from "../lib/api/getUser";

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [selectedPage, setSelectedPage] = useState<PageWithBlockArray | null>(
    null
  );

  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar setSelectedPage={setSelectedPage} user={props.user} />

      {selectedPage ? (
        <Page {...selectedPage} />
      ) : (
        <div className="flex w-full">no document</div>
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const userId = context.query.userId;
  //query is randomly "favicon.ico" sometimes?
  if (!userId || userId === "favicon.ico") {
    console.log("userId is", userId);
    return {
      props: {
        user: null,
      },
    };
  }

  const user = await getUser(parseInt(userId as string));
  return {
    props: { user },
  };
};
export default Home;
