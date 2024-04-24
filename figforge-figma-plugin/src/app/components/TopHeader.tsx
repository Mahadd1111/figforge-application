import React from 'react';

import './styles.css';
import Button from './Button';

import ArrowRightIcon from '../assets/icons/arrow-right.svg';
import { useRouter } from '../context/RouterContext';

type TopHeaderProps = {
  onClick?: () => void;
  btnLabel?: string;
  title: string;
  back?: boolean;
};

const TopHeader = ({ title, btnLabel, onClick, back }: TopHeaderProps) => {
  const router = useRouter();
  return (
    <div className="top-header">
      <div className="top-header-title">
        {back && (
          <div
            onClick={() => {
              router.navigate('/projects');
            }}
          >
            <img
              src={ArrowRightIcon}
              alt=""
              style={{
                transform: 'rotate(180deg)',
                cursor: 'pointer',
              }}
            />
          </div>
        )}

        <h6 className="semibold">{title}</h6>
      </div>
      {btnLabel && (
        <div className="top-header-action">
          <Button children={btnLabel} size="sm" type="text" onClick={onClick} />
        </div>
      )}
    </div>
  );
};

export default TopHeader;
