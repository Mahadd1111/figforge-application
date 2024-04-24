import React, { InputHTMLAttributes, useState } from 'react';

import './styles.css';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  placeholder?: string;
  maxLenght?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, hint, placeholder, maxLenght, ...props }) => {
  const [value, setValue] = useState<string>(props.value?.toString() || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div className="inputfield-container">
      <label className="inputfield-label" htmlFor={props.id}>
        {label}
      </label>
      <div className="inputfield">
        <input placeholder={placeholder} value={value} onChange={handleChange} maxLength={maxLenght} />
      </div>
      {hint && <p>{hint}</p>}
    </div>
  );
};

export default InputField;
