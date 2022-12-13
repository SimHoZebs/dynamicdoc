import React, { useEffect } from "react";
import { RenderElementProps } from "slate-react";

interface Props extends Pick<RenderElementProps, "attributes" | "children"> {}

const Line = (props: Props) => {
  useEffect(() => {
    console.log("Line created");
  }, []);

  return <div {...props.attributes}>{props.children}</div>;
};

export default Line;
