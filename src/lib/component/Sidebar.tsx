import { User } from "@prisma/client";
import {
  readDir,
  BaseDirectory,
  writeTextFile,
  FileEntry,
  readTextFile,
} from "@tauri-apps/api/fs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "../util/globalStates";
import { Doc, PageWithBlockArray } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<Doc | null>>;
  user: User | null;
}

const Sidebar = (props: Props) => {
  const user = useStoreState((state) => state.user);
  const setUser = useStoreActions((actions) => actions.setUser);
  const router = useRouter();
  const [docArray, setDocArray] = useState<FileEntry[]>([]);

  useEffect(() => {
    const getDocArrayFromDir = async () => {
      const docArray = await readDir("Basalt", { dir: BaseDirectory.Data });
      setDocArray(docArray);
    };
    getDocArrayFromDir();
  }, []);

  useEffect(() => {
    async function test() {
      const user = props.user;
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
    }
    test();
  }, [props.user, router, setUser]);

  return (
    <div className="flex min-w-[180px] flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Username: {user.name}</div>

      <div className="flex flex-col">
        {docArray
          ? docArray.map((doc, index) => (
              <button
                className="rounded p-1 hover:bg-dark-200"
                key={index}
                onClick={async () => {
                  const fileContent = await readTextFile("Basalt/" + doc.name, {
                    dir: BaseDirectory.Data,
                  });
                  props.setSelectedDoc({
                    title: doc.name ? doc.name : "",
                    content: fileContent.split(/\r?\n/),
                  });
                }}
              >
                {doc.name}
              </button>
            ))
          : null}
      </div>
      <button
        className="rounded bg-blue-500 p-1 "
        onClick={async () => {
          const fileContent = await readTextFile("Basalt/" + "test.md", {
            dir: BaseDirectory.Data,
          });
          console.log(fileContent.split(/\r?\n/));
        }}
      >
        test
      </button>
      <button
        className="flex rounded bg-blue-500 py-1 px-2 text-xs"
        onClick={async () => {
          await writeTextFile("Basalt/untitled.md", "", {
            dir: BaseDirectory.Data,
          });
          const fileArray = await readDir("Basalt", {
            dir: BaseDirectory.Data,
          });
          setDocArray(fileArray);
        }}
      >
        Create document
      </button>
    </div>
  );
};

export default Sidebar;
