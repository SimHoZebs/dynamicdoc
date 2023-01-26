import React, { useState } from "react";

const options = ["Planned", "On going", "Completed"];

const Select = (props: { selectedOption: number }) => {
  const [selectedOption, setSelectedOption] = useState(props.selectedOption);

  return (
    <select
      id="select"
      className="my-2 rounded bg-dark-300 p-1 outline-none"
      defaultValue={options[selectedOption]}
      onChange={(e) => setSelectedOption(e.target.selectedIndex)}
    >
      {options.map((option, index) => (
        <option
          className="hover:bg-dark-100 focus:bg-dark-100"
          key={index}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
