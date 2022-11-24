import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../lib/util/trpc";

const Home = () => {
  const router = useRouter();
  const util = trpc.useContext();
  const createUser = trpc.user.create.useMutation();

  return (
    <div>
      <button
        onClick={async () => {
          const user = await createUser.mutateAsync({ name: "test" });
          localStorage.setItem("userId", user.id.toString());
          router.push(`/${user.id}`);
        }}
      >
        create new user
      </button>

      <button
        onClick={async () => {
          const savedUserId = localStorage.getItem("userId");
          if (!savedUserId) return;

          const user = await util.user.get.fetch(parseInt(savedUserId));

          if (user) {
            router.push(`/${savedUserId}`);
          } else {
            console.log("User id not found, try creating new user");
          }
        }}
      >
        load saved user
      </button>
    </div>
  );
};

export default Home;
