import React from "react";
import { RenderElementProps } from "slate-react";

const Heading = (props: RenderElementProps) => {
  return <h1 {...props.attributes}>{props.children}</h1>;
};

export default Heading;
