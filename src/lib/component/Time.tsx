import React from "react";

//This is separate from TimeNode.tsx for DX reasons; It shouldn't need to be used anywhere else.
//Putting this component in TimeNode.tsx recompiles TimeNode as well, making it different from the TimeNode Editor.tsx is referencing.
const Time = () => {
  const [time, setTime] = React.useState(new Date().toString().slice(0, 24));

  //setInterval to update time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toString();

      setTime(time.slice(0, 24));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return <div className="inline-block rounded bg-dark-300 p-1">{time}</div>;
};

export default Time;
