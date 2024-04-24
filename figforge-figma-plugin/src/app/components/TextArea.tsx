import React, { TextareaHTMLAttributes, useState } from 'react';

import './styles.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  placeholder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, hint, placeholder, ...props }) => {
  const [value, setValue] = useState<string>(props.value?.toString() || '');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <textarea placeholder={placeholder} value={value} onChange={handleChange} />
      </div>
      {hint && <p>{hint}</p>}
    </div>
  );
};

export default TextArea;
