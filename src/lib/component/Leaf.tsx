import React from "react";
import { RenderLeafProps } from "slate-react";

const Leaf = (props: RenderLeafProps) => {
  return props.leaf.special === "property" ? (
    <span {...props.attributes} className="bg-dark-600">
      {props.children}
    </span>
  ) : (
    <span {...props.attributes} className={`${props.leaf.special}`}>
      {props.children}
    </span>
  );
};

export default Leaf;
