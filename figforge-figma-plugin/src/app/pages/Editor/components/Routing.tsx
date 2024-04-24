import React from 'react';
import { InputField } from '../../../components';
import { Button } from '../../../components';
import { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../../../context/ProjectContext';
import { supabase } from '../../../supabaseClient';

const Routing = () => {

  const { project } = useContext(ProjectContext);
  const [pages, setPages] = useState([])
  const [routes, setRoutes] = useState({});

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
      const initialRoutes = {};
      data.forEach(page => {
        initialRoutes[page.id] = page.route || '/';
      });
      setRoutes(initialRoutes);
      setPages(result)
      console.log('Result from get_pages_by_project_id RPC:', result);
      return result;
    } catch (error) {
      console.error('Error in fetchPagesByProjectId function:', error.message);
      return null;
    }
  }

  useEffect(() => {
    fetchPagesByProjectId(parseInt(project.id, 10))
  }, [])

  const handleRouteChange = (pageId, route) => {
    setRoutes(prevRoutes => ({
      ...prevRoutes,
      [pageId]: route,
    }));
  };

  const saveRoutes = async () => {
    try {
      const updates = Object.keys(routes).map(pageId => ({
        id: pageId,
        route: routes[pageId],
      }));

      const { error } = await supabase.rpc('update_page_routes', {
        updates,
      });

      if (error) {
        console.error('Error updating page routes:', error.message);
        return;
      }

      console.log('Page routes updated successfully');
    } catch (error) {
      console.error('Error saving page routes:', error.message);
    }
  };


  const PageItem = ({
    pageName,
    pageId,
  }: {
    pageName: string;
    pageId: string;
  }) => {
    return (
      <div className="page-item" key={pageId}>
        <div className="page-item-info">
          <p className="md-medium gray-700">{pageName}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="tab-data-container">
      <div className="tab-content">
        <div className="page-data">
          <div className="pages-list">
            <div className="pages-list-title">
              <p className="md-normal gray-800">Pages</p>
              <p className="md-normal gray-800">Page Route</p>
            </div>
            <hr/>
            <div className="page-route-list">
              {
                pages.map((item, index) => {
                  return (
                    <div className='page-route'>
                      <div className='page-route-data'>
                        <div className='page-item'><PageItem key={index} pageName={item.page_name} pageId={item.id} /></div>
                        <div className='page-input'><InputField key={index} value={routes[item.id] || '/'} onChange={e => handleRouteChange(item.id, e.target.value)}/></div>
                      </div>
                      {/* <hr/> */}
                    </div>
                  )
                })
              }
            </div>
            <div className='save-routes-button'>
              <Button size='md' type='text' onClick={saveRoutes} children='Save Routes'></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routing;
