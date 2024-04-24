import React, { useState, ReactNode } from 'react';

interface AccordionProps {
  title: string;
  label?: string;
  labelColor?: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, label, labelColor, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <div className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-title-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M6.678 8.70715C6.30316 9.09762 5.69441 9.09762 5.31957 8.70715L1.48117 4.70871C1.20528 4.42132 1.12432 3.99336 1.27425 3.61851C1.42419 3.24366 1.77205 3 2.16188 3H9.83868C10.2255 3 10.5764 3.24366 10.7263 3.61851C10.8763 3.99336 10.7923 4.42132 10.5194 4.70871L6.681 8.70715H6.678Z"
              fill="#1D2939"
            />
          </svg>
          <p className="sm-normal gray-800">{title}</p>
        </div>
        <p className={`xs-normal ${labelColor}`}>{label}</p>
      </div>
      {isOpen && children}
    </div>
  );
};

export default Accordion;
