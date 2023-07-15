import React, { useState } from "react";
import Option from "@/components/Options";

interface IProps {
  options: React.ReactElement[];
  onChange?: (selectedIndex: number) => void;
  value?: number;
  labelText?: string;
}
const RadioGroup = ({ options, onChange, value, labelText }: IProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(value);
  function onSelect(index: number) {
    setSelectedIndex(index);
    onChange && onChange(index);
  }
  return (
    <div>
      {labelText && (
        <label className="block text-gray-600 mb-2">{labelText}</label>
      )}
      <div className="flex justify-evenly flex-wrap gap-3">
        {options.map((el, index) => (
          <Option
            key={`el_${index}`}
            index={index}
            selectedIndex={selectedIndex}
            onSelect={(index) => onSelect(index)}
          >
            {el}
          </Option>
        ))}
      </div>
    </div>
  );
};
export default RadioGroup;
