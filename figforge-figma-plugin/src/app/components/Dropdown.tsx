import React, { InputHTMLAttributes } from 'react';
import Select from 'react-select';

import './styles.css';

interface DropdownProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  options: { value: string; label: string }[]; // Add options prop for dropdown items
  maxLenght?: number;
}

const Dropdown: React.FC<DropdownProps> = ({ label, hint, options, ...props }) => {
  const handleChange = (selectedOption: any) => {
    // Handle change for react-select
    if (props.onChange) {
      props.onChange(selectedOption);
    }
  };

  return (
    <div className="inputfield-container">
      <label className="inputfield-label" htmlFor={props.id}>
        {label}
      </label>
      {/* <div className="inputfield"> */}
      <Select options={options} onChange={handleChange} placeholder={props.placeholder} />
      {/* </div> */}
      {hint && <p>{hint}</p>}
    </div>
  );
};

export default Dropdown;
