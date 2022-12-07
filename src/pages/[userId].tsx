import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import Doc from "../lib/component/Doc";
import { Doc as DocProps } from "../lib/util/types";
import { caller } from "../server/routers/_app";

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [selectedDoc, setSelectedDoc] = useState<DocProps | null>(null);

  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar user={props.user} setSelectedDoc={setSelectedDoc} />

      {selectedDoc ? (
        <Doc {...selectedDoc} />
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
    return {
      props: {
        user: null,
      },
    };
  }

  const user = await caller.user.get(parseInt(userId as string));
  return {
    props: { user },
  };
};
export default Home;
