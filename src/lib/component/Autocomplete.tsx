const Autocomplete = ({ nodePos }: { nodePos: number[] }) => {
  return (
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
