import { useRouter } from "next/router";
import React from "react";
import createUser from "../lib/api/createUser";
import getUser from "../lib/api/getUser";

const Home = () => {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={async () => {
          const user = await createUser("test");
          localStorage.setItem("userId", user.id.toString());
          router.push(`/${user.id}`);
        }}
      >
        create new user
      </button>

      <button
        onClick={async () => {
          const savedUserId = localStorage.getItem("userId");
          if (savedUserId) {
            const user = await getUser(parseInt(savedUserId));

            if (!user) {
              console.log(
                `user with ${savedUserId} not found, try creating a new user`
              );
              return;
            }

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
