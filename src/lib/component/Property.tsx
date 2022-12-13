import React from "react";
import { RenderElementProps } from "slate-react";

const Property = (props: RenderElementProps) => {
  return (
    <div className="text-blue-500" {...props.attributes}>
      {props.children}
    </div>
  );
};

export default Property;
