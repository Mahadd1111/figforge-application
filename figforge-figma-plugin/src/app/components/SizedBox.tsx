import React from 'react';

interface SizedBoxProps {
  width?: string;
  height?: string;
}

const SizedBox: React.FC<SizedBoxProps> = ({ width, height }) => {
  return <div style={{ width, height }} />;
};

export default SizedBox;
