import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $insertNodes, TextNode } from "lexical";
import { $createPropertiesNode, PropertiesNode } from "../CustomTextNode";

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
const Autocomplete = () => {
  const [editor] = useLexicalComposerContext();
  const [nodePos, setNodePos] = useState<number[]>([0, 0]);

  useEffect(() => {
    const textNodeTransform = (textNode: TextNode) => {
      const textContent = textNode.getTextContent();
      console.log("text content", textContent);

      if (textContent.includes("{")) {
        editor.update(() => {
          textNode.setTextContent(textContent.replace("{", ""));
          const propertiesNode = $createPropertiesNode("{");
          $insertNodes([propertiesNode]);
        });
      }
    };

    //Gives position for Autocomplete component to attach to.
    //TODO: This only gives position when something after { is typed. Make it so that it gives position the moment it is created.
    const PropertiesNodeTransform = (coloredNode: PropertiesNode) => {
      //TODO: if } is typed, a text node has to be inserted next
      const el = editor.getElementByKey(coloredNode.__key);
      if (!el) return;
      const { x, y } = el.getBoundingClientRect();

      console.log("getBoudingClientRec", el?.getBoundingClientRect());

      setNodePos([x, y]);
    };

    const removeTextNodeTransform = editor.registerNodeTransform(
      TextNode,
      textNodeTransform
    );
    const removePropertiesNodeTransform = editor.registerNodeTransform(
      PropertiesNode,
      PropertiesNodeTransform
    );

    return () => {
      removeTextNodeTransform();
      removePropertiesNodeTransform();
    };
  }, [editor]);

  return nodePos[0] + nodePos[1] === 0 ? null : (
    <div
      className="absolute flex w-min"
      //inline styles because styles can't be made on demand
      style={{
        left: `${nodePos[0]}px`,
        top: `${nodePos[1] + 21}px`,
        // transform: `translateX(${nodePos[0]}px) translateY(${nodePos[1]}px)`,
      }}
    >
      option1{" "}
    </div>
  );
};

export default Autocomplete;
