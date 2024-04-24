import React from 'react';
import { Accordion } from '../../../components';
import { Frame } from '../Editor';
import { TargetIcon } from '../../../assets/icons';

function isNameValid(name) {
  console.log("Title is : ",name)
  if(name==null || name=="" || name=="Enter Page Title"){
    return false
  }else{
    return true
  }
}

function hasGridLayout(frameInfo) {
  const val = frameInfo[0]?.pattern === 'GRID';
  if (val) {
    return true;
  }
  return false;
}

function checkDesktop(isResponsive){
  if(isResponsive.desktop){
    return true
  }
  else{
    return false
  }
}

function checkResponsive(isResponsive){
  if(isResponsive.tablet || isResponsive.mobile){
    return true
  }
  else{
    return false
  }
}

const Guidelines = ({ id, title,isResponsive }: Frame["frameData"] & {isResponsive: { desktop: boolean; tablet: boolean; mobile: boolean } }) => {
  const isTitleValid = isNameValid(title);
  const isDesktopSet = checkDesktop(isResponsive)
  const isPageResponsive = checkResponsive(isResponsive)
  id;
  const GuidelineItem = ({
    title,
    description,
    targetCount,
    type,
    id,
  }: {
    title: string;
    description: string;
    targetCount: number;
    type: 'warning' | 'error';
    id?: string;
  }) => {
    return (
      <div className="guideline-item" key={id}>
        <div className="guideline-info">
          <p className={`sm-medium ${type}-600`}>{title}</p>
          <p className="xs-normal gray-500">{description}</p>
        </div>
        <div className="guideline-target">
          <p className="sm-medium">{targetCount} x</p>
          <img src={TargetIcon} alt="crosshair" />
        </div>
      </div>
    );
  };

  return (
    <Accordion
      title="Guidelines"
      label="4 warnings"
      labelColor="warning-600"
      children={
        <>
          <div className="guidelines-container">
            {!isTitleValid && (
              <GuidelineItem
                title="Invalid Name"
                targetCount={1}
                description="The Page Name is Empty"
                type="error"
              />
            )}
            {!isDesktopSet &&(
              <GuidelineItem
                title="Empty Desktop Frame"
                targetCount={1}
                description="Desktop Frame Must Be Selected"
                type="error"
              />
            )}
            {!isPageResponsive &&(
              <GuidelineItem
                title="Page is Not Responsive"
                targetCount={1}
                description="Please select Mobile or Tablet Frames"
                type="warning"
              />
            )}
          </div>
        </>
      }
    />
  );
};

export { hasGridLayout };

export default Guidelines;
