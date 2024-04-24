import React, { useState, useEffect, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { InputField, TopHeader, Button } from '../../components/index';
import { SelectFrameIcon } from '../../assets/icons/index';

import { ProjectContext } from '../../context/ProjectContext';
import { Pages, Guidelines, Responsiveness } from './components';
import { useRouter } from '../../context/RouterContext';

import './Editor.css';
import Routing from './components/Routing';
import { supabase } from '../../supabaseClient';


interface FrameDetails {
  frameData: {
    id: string;
    name: string;
    layoutGrids: { [key: string]: any }[];
  },
  externalData: {

  },
  dynamicComponents: boolean
}

type Frame = {
  frameData: {
    id: string;
    title: string;
  },
  externalData: {

  },
  dynamicComponents: boolean
};

export default function Editor() {
  const router = useRouter();
  const { project } = useContext(ProjectContext);


  const [selectedFrameInfo, setSelectedFrameInfo] = useState<FrameDetails>(null);
  const [desktopFrame, setDesktopFrame] = useState<FrameDetails>(null);
  const [tabletFrame, setTabletFrame] = useState<FrameDetails>(null);
  const [mobileFrame, setMobileFrame] = useState<FrameDetails>(null);
  const [isResponsive, setIsResponsive] = useState({ desktop: false, tablet: false, mobile: false })
  const [title, setTitle] = useState("Enter Page Title")

  // function imageAPICall() {
  //   // Make the API request
  //   console.log("Calling AXIOS API")
  //   axios.get('https://fakestoreapi.com/products')
  //       .then(response => {
  //           // Handle the response data
  //           console.log(response.data);
  //       })
  //       .catch(error => {
  //           // Handle any errors
  //           console.error('Error fetching data:', error);
  //       });
  // }

  // useEffect(()=>{
  //   imageAPICall();
  // },[]);


  // fetches the selected frame info from the figma file
  useEffect(() => {
    const handleSelectMessage = (event) => {
      console.log(event);
      if (event.data.pluginMessage.type === 'selectedFrameInfo') {
        setSelectedFrameInfo(event.data.pluginMessage.data);
      }
    };
    window.addEventListener('message', handleSelectMessage);
    return () => {
      window.removeEventListener('message', handleSelectMessage);
    };
  }, []);

  // Console log when selected frame is selected
  useEffect(() => {
    console.log("-----------Change in Data------------")
    console.log("Editor-Selected Frame: ", selectedFrameInfo)
    console.log("Editor-Desktop Frame: ", desktopFrame)
    console.log("Editor-Tablet Frame: ", tabletFrame)
    console.log("Editor-Mobile Frame: ", mobileFrame)
    console.log("--------------------------------------")
  }, [selectedFrameInfo, desktopFrame, tabletFrame, mobileFrame]);

  function ExportFunction() {
    console.log("Navigating to exprort")
    router.navigate("/export")
  }

  return (
    <div>
      <TopHeader
        btnLabel="Export Project"
        title={project.name.length > 28 ? project.name.substring(0, 25) + '...' : project.name || 'Project Editor'}
        onClick={() => { ExportFunction() }}
        back
      />

      <Tabs>
        <TabList>
          <Tab>General</Tab>
          <Tab>Routing</Tab>
          {/* <Tab>Variables</Tab>
          <Tab>Animations</Tab> */}
          <Tab>Pages</Tab>
        </TabList>

        <TabPanel>
          {selectedFrameInfo ? (
            <div className="tab-data-container">
              <div className="tab-content">
                <SelectedFrame
                  id={selectedFrameInfo.frameData.id}
                  title={selectedFrameInfo.frameData.name}
                />
                <PageData
                  id={selectedFrameInfo.frameData.id}
                  title={title}
                  setTitle={setTitle}
                />
                <Guidelines
                  id={selectedFrameInfo.frameData.id}
                  title={title}
                  isResponsive={isResponsive}
                />
                <Responsiveness
                  currentFrame={selectedFrameInfo}
                  desktopFrame={desktopFrame}
                  setDesktopFrame={setDesktopFrame}
                  tabletFrame={tabletFrame}
                  setTabletFrame={setTabletFrame}
                  mobileFrame={mobileFrame}
                  setMobileFrame={setMobileFrame}
                  isResponsive={isResponsive}
                  setIsResponsive={setIsResponsive}
                />
              </div>
            </div>
          ) : (
            <SelectFrame />
          )}
        </TabPanel>
        <TabPanel>
          <Routing/>
        </TabPanel>
        {/* <TabPanel>
          <h2>Variables</h2>
        </TabPanel>
        <TabPanel>
          <h2>Animation</h2>
        </TabPanel> */}
        <TabPanel>
          <Pages />
        </TabPanel>
      </Tabs>
      {/* the following is for the Create & Delete button, it only shows when you select a frame */}
      {selectedFrameInfo && (
        <div className="cta-btn">
          <Button
            children="Delete Page"
            size="md"
            type="secondary"
            width="w-full"
            onClick={() => {
              setSelectedFrameInfo(null);
              //router.navigate('/editor');
            }}
          />
          <Button
            children="Create Page"
            size="md"
            type="primary"
            width="w-full"
            onClick={() => {
              createPage(desktopFrame, tabletFrame, mobileFrame, title,project.id);
              // downloadPage(desktopFrame, tabletFrame, mobileFrame, title, project.id);
            }}
          />
        </div>
      )}
    </div>
  );



  function downloadPage(desktopFrame: FrameDetails,
    tabletFrame: FrameDetails,
    mobileFrame: FrameDetails,
    pageTitle: string,
    projectId: string
  ) {
    const createJsonString = (data: any) => (data ? JSON.stringify(data) : null);

    const _desktop_external_data = createJsonString(desktopFrame?.externalData);
    const _desktop_data = createJsonString(desktopFrame?.frameData);

    const _tablet_external_data = createJsonString(tabletFrame?.externalData);
    const _tablet_data = createJsonString(tabletFrame?.frameData);

    const _mobile_external_data = createJsonString(mobileFrame?.externalData);
    const _mobile_data = createJsonString(mobileFrame?.frameData);

    if (_desktop_data) {
      // Create a Blob containing the JSON data
      const blob = new Blob([_desktop_data], { type: 'application/json' });

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);

      // Set the download attribute with the desired file name
      downloadLink.download = `desktop_data.json`;

      // Append the link to the body (you can also append it to a specific element)
      document.body.appendChild(downloadLink);

      // Trigger a click on the link to start the download
      downloadLink.click();

      // Remove the link from the DOM
      document.body.removeChild(downloadLink);

      // Log a message indicating the successful download
      console.log(`Desktop data download initiated.`);
    }
  }

  async function createPage(
    desktopFrame: FrameDetails,
    tabletFrame: FrameDetails,
    mobileFrame: FrameDetails,
    pageTitle: string,
    projectId: string
  ) {

    // make a call to supabase and create a new page

    const createJsonString = (data: any) => (data ? JSON.stringify(data) : null);

    const _desktop_external_data = createJsonString(desktopFrame?.externalData);
    const _desktop_data = createJsonString(desktopFrame?.frameData);

    const _tablet_external_data = createJsonString(tabletFrame?.externalData);
    const _tablet_data = createJsonString(tabletFrame?.frameData);

    const _mobile_external_data = createJsonString(mobileFrame?.externalData);
    const _mobile_data = createJsonString(mobileFrame?.frameData);

    try {
      const { data, error } = await supabase.rpc('add_page', {
        _project_id: projectId,
        _page_name: pageTitle,
        _desktop_frame_data: _desktop_data,
        _tablet_frame_data: _tablet_data,
        _mobile_frame_data: _mobile_data,
        _desktop_external_data,
        _tablet_external_data,
        _mobile_external_data,
      });
      if (error) {
        console.error('Error calling add_page RPC:', error.message);
        return null;
      }
      const result = data;
      console.log('Result from add_page RPC Successful:', result);
      setSelectedFrameInfo(null);
      setDesktopFrame(null);
      setTabletFrame(null);
      setMobileFrame(null);
      setIsResponsive({ desktop: false, tablet: false, mobile: false })
      setTitle("Enter Page Title")
    } catch (error) {
      console.error('Error in createPage function:', error.message);
    }
  }
}

const SelectedFrame = ({ title }: Frame["frameData"]) => {
  return (
    <div className="selected-frame">
      <div className="selected-frame-info">
        <p className="sm-normal gray-500">Selected Frame</p>
        <p className="lg-medium gray-700">{title}</p>
      </div>

      <div className="selected-frame-actions">
        <Button
          size="sm"
          type="text"
          children="New Page"
          onClick={() => {
            console.log('export this frame');
          }}
        />
      </div>
    </div>
  );
};

const PageData = ({ title, setTitle }: Frame["frameData"] & { setTitle: (title: string) => void }) => {
  return (
    <div className="page-data">
      <InputField
        label="Page Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
    </div>
  );
};

const SelectFrame = () => {
  return (
    <div className="select-frame">
      <img src={SelectFrameIcon} alt="select a frame" />
      <p
        className="md-normal gray-500"
        style={{
          width: '70%',
        }}
      >
        Please select a frame to create a new page
      </p>
    </div>
  );
};



export { SelectFrame, Frame, FrameDetails, SelectedFrame };
