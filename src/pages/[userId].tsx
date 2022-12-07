import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useEffect, useState } from "react";
import Sidebar from "../lib/component/Sidebar";
import Page from "../lib/component/Page";
import { Doc, PageWithBlockArray } from "../lib/util/types";
import { caller } from "../server/routers/_app";

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <Sidebar user={props.user} setSelectedDoc={setSelectedDoc} />

      {selectedDoc ? (
        <Page {...selectedDoc} />
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
