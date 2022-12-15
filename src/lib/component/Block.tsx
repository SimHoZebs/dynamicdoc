import React, { useEffect } from "react";
import { RenderElementProps } from "slate-react";

//TODO: debounce updating block
const Block = (props: RenderElementProps) => {
  useEffect(() => {
    console.log("my id is", props.element.id);
  }, [props.element.id]);

  const WrapperElement = ({ children }: { children: React.ReactNode }) => {
    switch (props.element.type) {
      case "heading_one":
        return <h1 className="text-4xl">{children}</h1>;
      case "heading_two":
        return <h2 className="text-3xl">{children}</h2>;
      case "heading_three":
        return <h3 className="text-2xl">{children}</h3>;
      case "heading_four":
        return <h4 className="text-xl">{children}</h4>;
      case "heading_five":
        return <h5 className="text-lg">{children}</h5>;
      case "heading_six":
        return <h6 className="text-base">{children}</h6>;
      default:
        return <div>{props.children}</div>;
    }
  };

  return (
    <div {...props.attributes}>
      <WrapperElement>{props.children}</WrapperElement>
    </div>
  );
};

export default Block;
