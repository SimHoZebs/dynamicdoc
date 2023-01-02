import React, { useEffect } from "react";
import { RenderLeafProps } from "slate-react";

const Leaf = (props: RenderLeafProps) => {
  useEffect(() => {
    if (props.leaf.special === "property") {
      console.log("children", props.children);

      if (props.text.text === "{time}") {
        console.log("show time");
      }
    }
  }, [props.children, props.leaf.special, props.text]);

  return props.leaf.special === "property" ? (
    <span {...props.attributes}>{props.children}</span>
  ) : (
    <span {...props.attributes} className={`${props.leaf.special}`}>
      {props.children}
    </span>
  );
};

export default Leaf;
