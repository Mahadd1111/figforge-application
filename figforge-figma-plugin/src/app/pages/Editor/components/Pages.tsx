import React, { useEffect,useState } from 'react';
import { Button } from '../../../components';
import { DeleteIcon, EditIcon } from '../../../assets/icons';
import { ProjectContext } from '../../../context/ProjectContext';
import { useContext } from 'react';
import { supabase } from '../../../supabaseClient';


function calculateTimeDifference(updatedAt: string): string {
  const updatedDate = new Date(updatedAt);
  const currentDate = new Date();

  const timeDifferenceInMilliseconds = currentDate.getTime() - updatedDate.getTime();
  const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000;
  const timeDifferenceInMinutes = timeDifferenceInSeconds / 60;
  const timeDifferenceInHours = timeDifferenceInMinutes / 60;
  const timeDifferenceInDays = timeDifferenceInHours / 24;
  const timeDifferenceInWeeks = timeDifferenceInDays / 7;
  const timeDifferenceInMonths = timeDifferenceInDays / 30;

  if (timeDifferenceInMonths >= 1) {
    return `${Math.floor(timeDifferenceInMonths)} months ago`;
  } else if (timeDifferenceInWeeks >= 1) {
    return `${Math.floor(timeDifferenceInWeeks)} weeks ago`;
  } else if (timeDifferenceInDays >= 7) {
    return `${Math.floor(timeDifferenceInDays)} days ago`;
  } else if (timeDifferenceInHours >= 24) {
    return `${Math.floor(timeDifferenceInHours)} hours ago`;
  } else if (timeDifferenceInMinutes >= 1) {
    return `${Math.floor(timeDifferenceInMinutes)} minutes ago`;
  } else {
    return 'just now';
  }
}

async function deletePage(projectId: number, pageName: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('delete_page', {
      _project_id: projectId,
      _page_name: pageName,
    }); 

    if (error) {
      console.error('Error calling delete_page RPC:', error.message);
      throw new Error('Failed to delete page');
    } 

    console.log(`Page with name ${pageName} deleted successfully.`);
  } catch (error) {
    console.error('Error in deletePage function:', error.message);
    throw error;
  }
}




const PageItem = ({
  pageName,
  pageLastUpdated,
  pageId,
  onDeleteClick,
}: {
  pageName: string;
  pageLastUpdated: string;
  pageId: string;
  onDeleteClick: () => void;
}) => {
  return (
    <div className="page-item" key={pageId}>
      <div className="page-item-info">
        <p className="md-medium gray-700">{pageName}</p>
        <p className="xs-normal gray-500">{pageLastUpdated}</p>
      </div>
      <div className="page-item-actions">
        <div className="action-item" onClick={onDeleteClick}>
            <img src={DeleteIcon} alt="" />
        </div>
        <div className="action-item">
          <img src={EditIcon} alt="" />
        </div>
      </div>
    </div>
  );
};



const Pages = () => {
  const { project } = useContext(ProjectContext);
  const [pages,setPages]=useState([])
  async function fetchPagesByProjectId(projectId: number) {
    try {
      const { data, error } = await supabase.rpc('get_pages_by_project_id', {
        _project_id: projectId,
      });
  
      if (error) {
        console.error('Error calling get_pages_by_project_id RPC:', error.message);
        return null;
      }
      const result = data;
      setPages(result)
      console.log('Result from get_pages_by_project_id RPC:', result);
      return result;
    } catch (error) {
      console.error('Error in fetchPagesByProjectId function:', error.message);
      return null;
    }
  }
  
  useEffect(()=>{
    fetchPagesByProjectId(parseInt(project.id, 10))
  },[])

  const handleDeleteClick = async (projectId,pageName) => {
    try {
      await deletePage(projectId, pageName);
      const updatedPages = pages.filter(item => item.page_name !== pageName);
      setPages(updatedPages);
    } catch (error) {
      // Handle error
      console.error('Error deleting page:', error.message);
    }
  };
  

  return (
    <div className="pages-list">
      <div className="pages-list-title">
        <p className="md-normal gray-800">Pages</p>
        <Button size="sm" type="text" children="Add New Page" />
      </div>
      <div className="pages-list-body">
        {
          pages.map((item,index)=>{
            let last_update= calculateTimeDifference(item.updated_at)
            return(
              <PageItem key={item.id} pageName={item.page_name} pageLastUpdated={last_update} pageId={item.id} onDeleteClick={()=>handleDeleteClick(project.id,item.page_name)}/>
            )
          })
        }
      </div>
    </div>
  );
};

export default Pages;
