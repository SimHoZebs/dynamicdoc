import { useRouter } from "next/router";
import React from "react";
import createUser from "../lib/api/createUser";
import getUser from "../lib/api/getUser";
import { useStoreActions } from "../lib/util/globalStates";

const Home = () => {
  const router = useRouter();
  const setUser = useStoreActions((actions) => actions.setUser);

  return (
    <div>
      <button
        onClick={async () => {
          const user = await createUser("test");
          setUser(user);
          router.push(`/${user.id}`);
        }}
      >
        create new user
      </button>

      <button
        onClick={async () => {
          let user = await getUser(2);
          if (!user) {
            console.log("User id 2 not found, try creating new user");
          } else {
            setUser(user);
            router.push(`/${user.id}`);
          }
        }}
      >
        load user 2
      </button>
    </div>
  );
};

export default Home;
