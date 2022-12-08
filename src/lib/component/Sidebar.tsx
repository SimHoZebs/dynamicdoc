import {
  readDir,
  BaseDirectory,
  writeTextFile,
  FileEntry,
  readTextFile,
} from "@tauri-apps/api/fs";
import React, { useEffect, useState } from "react";
import { Doc } from "../util/types";

interface Props {
  setSelectedDoc: React.Dispatch<React.SetStateAction<Doc | null>>;
}

const Sidebar = (props: Props) => {
  const [docArray, setDocArray] = useState<FileEntry[]>([]);

  useEffect(() => {
    const getDocArrayFromDir = async () => {
      const docArray = await readDir("Basalt", { dir: BaseDirectory.Data });
      setDocArray(docArray);
    };
    getDocArrayFromDir();
  }, []);

  return (
    <div className="flex min-w-[180px] flex-col items-center justify-start gap-y-2 bg-dark-700 p-3">
      <div>Hello</div>

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
