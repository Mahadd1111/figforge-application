import React, { useEffect, useState } from 'react';
import { FrameDetails } from '../Editor';
import { MonitorIcon, PhoneIcon, SuccessIcon, TabletIcon, WarningIcon } from '../../../assets/icons';
import { Accordion } from '../../../components';

const Responsiveness = ({
  currentFrame,
  desktopFrame,
  setDesktopFrame,
  tabletFrame,
  setTabletFrame,
  mobileFrame,
  setMobileFrame,
  isResponsive,
  setIsResponsive
}: {
  currentFrame: FrameDetails | null;
  desktopFrame: FrameDetails | null;
  setDesktopFrame: (frame: FrameDetails | null) => void;
  tabletFrame: FrameDetails | null;
  setTabletFrame: (frame: FrameDetails | null) => void;
  mobileFrame: FrameDetails | null;
  setMobileFrame: (frame: FrameDetails | null) => void;
  isResponsive: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  setIsResponsive: React.Dispatch<React.SetStateAction<{
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  }>>;
}) => {
  /*   const [selectedFrames, setSelectedFrames] = useState({
    desktop: null,
    tablet: null,
    mobile: null,
  }); */

  const handleItemClick = (device: string) => {
    switch (device) {
      case 'desktop':
        if(desktopFrame==null){
          setDesktopFrame(currentFrame);
          setIsResponsive(prevState => ({ ...prevState, desktop: true }));
        }
        else{
          setDesktopFrame(null)
          setIsResponsive(prevState => ({ ...prevState, desktop: false }));
        }
        console.log('desktopFrame: ', desktopFrame);
        break;
      case 'tablet':
        if(tabletFrame==null){
          setTabletFrame(currentFrame);
          setIsResponsive(prevState => ({ ...prevState, tablet: true }));
        }
        else{
          setTabletFrame(null)
          setIsResponsive(prevState => ({ ...prevState, tablet: false }));
        }
        break;
      case 'mobile':
        if(mobileFrame==null){
          setMobileFrame(currentFrame);
          setIsResponsive(prevState => ({ ...prevState, mobile: true }));
        }
        else{
          setMobileFrame(null)
          setIsResponsive(prevState => ({ ...prevState, mobile: false }));
        }
        break;
      default:
        break;
    }

    //checkWarnings();
  };

  const ResponsivenessItem = ({
    label,
    frameTitle,
    icon,
    onClick,
  }: {
    label: string;
    frameTitle?: string;
    icon: string;
    onClick: () => void;
  }) => {
    console.log('frameTitle: ', frameTitle);
    return (
      <div className="responsiveness-item" onClick={onClick}>
        <img src={frameTitle === undefined ? WarningIcon : SuccessIcon} alt="" />
        <div className="responsiveness-info">
          <img src={icon} alt="" />
          <p className={` gray-${frameTitle ? '700 sm-medium' : '400 sm-normal'}`}>{frameTitle || 'Select a frame'}</p>
        </div>
        <p className="xs-normal gray-400">{label}</p>
      </div>
    );
  };

  /* const [warningsCount, setWarningsCount] = useState(3);

  const checkWarnings = () => {
    console.log('desktopFrame: ', desktopFrame);
    if (desktopFrame != null) {
      setWarningsCount(warningsCount - 1);
    }

    if (tabletFrame != null) {
      setWarningsCount(warningsCount - 1);
    }

    if (mobileFrame != null) {
      setWarningsCount(warningsCount - 1);
    }
  }; */

  return (
    <Accordion
      title="Responsiveness"
      /* label={warningsCount > 0 ? `${warningsCount} warnings` : 'No warnings'} */
      children={
        <>
          <div className="responsiveness-container">
            <ResponsivenessItem
              label="Desktop"
              frameTitle={desktopFrame?.frameData.name}
              icon={MonitorIcon}
              onClick={() => handleItemClick('desktop')}
            />
            <ResponsivenessItem
              label="Tablet"
              frameTitle={tabletFrame?.frameData.name}
              icon={TabletIcon}
              onClick={() => handleItemClick('tablet')}
            />
            <ResponsivenessItem
              label="Mobile"
              frameTitle={mobileFrame?.frameData.name}
              icon={PhoneIcon}
              onClick={() => handleItemClick('mobile')}
            />
          </div>
        </>
      }
    />
  );
};

export default Responsiveness;
