import React from 'react';

import './styles.css';

type ButtonProps = {
  size: 'sm' | 'md' | 'lg';
  type: 'primary' | 'secondary' | 'ghost' | 'text';
  onClick?: () => void;
  disabled?: boolean;
  children: string;
  width?: string;
  submit?: boolean;
};

const Button = ({ size, type, onClick, disabled, children, width, submit }: ButtonProps) => {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={`btn ${size} ${type} ${width}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
