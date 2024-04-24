import React, { useContext, useEffect, useState } from 'react';

import { ArrowRightIcon } from '../../assets/icons/index';
import { useRouter } from '../../context/RouterContext';
import { TopHeader, SearchBar, Button } from '../../components/index';

import './Projects.css';
import { useUser } from '../../context/UserContext';
import { ProjectContext } from '../../context/ProjectContext';
import { DeleteIcon } from '../../assets/icons/index';
import { supabase } from '../../supabaseClient';

export default function Projects() {
  const router = useRouter();
  const { userData } = useUser();

  useEffect(() => {
    // async function fetchProjects(userId){
    //   let { data, error } = await supabase.rpc('get_projects_by_user_id', {user_id:userId})
    //   if (error) console.error(error)
    //   else console.log(data)
    // }
    // const response = fetchProjects(userData.user_id)
    // console.log("Fetched Projects for user: ",response)
    console.log(userData.projects)
  }, [userData])

  const UpgradeRow = ({ projectsCount }) => {
    return (
      <div className="project-count">
        <p className="sm-medium gray-500">
          <span className="bold">{projectsCount}</span>/6 projects created 
        </p>
        <Button children="Logout" size="sm" type="text" onClick={() => {router.navigate('/') }} />
      </div>
    );
  };

  async function deleteProject(projectId: number, userId: number): Promise<void> {
    try {
      const { error } = await supabase.rpc('delete_project', {
        project_id: projectId,
        user_id: userId,
      });

      if (error) {
        console.error('Error calling delete_project RPC:', error.message);
        throw new Error('Failed to delete project');
      }

      console.log(`Project with id ${projectId} deleted successfully.`);
      userData.projects = userData.projects.filter(project => project.project_id !== projectId);
    } catch (error) {
      console.error('Error in deleteProject function:', error.message);
      throw error;
    }
  }

  async function handleDeleteClick(project_id: number, user_id: number) {
    try {
      await deleteProject(project_id, user_id);
      router.navigate('/projects')
    } catch (error) {
      // Handle error
      console.error('Error deleting page:', error.message);
    }
  }

  return (
    <div className="projects-page">
      <TopHeader
        title="Projects"
        btnLabel={userData.projects?.length > 5 ? "Project Limit Reached" : "Create Project"}
        onClick={userData.projects?.length > 5 ? undefined : () => {
          router.navigate('/projects/create');
        }}
      />
      <SearchBar
        placeholder="Search projects..."
        onSearch={() => {
          console.log('searching');
        }}
      />
      <UpgradeRow projectsCount={userData.projects?.length} />
      <div className="projects-list">
        {userData.projects?.map((project) => (
          <ProjectItem
            key={project.project_id}
            projectTitle={project.project_name}
            projectPages={project.page_count}
            projectId={project.project_id.toString()}
            onDeleteClick={() => handleDeleteClick(project.project_id, userData.user_id)}
          />
        ))}
      </div>
    </div>
  );
}

type ProjectProps = {
  projectTitle: string;
  projectPages: number;
  projectId?: string;
  onDeleteClick?: () => void;
};

const ProjectItem = ({ projectTitle, projectPages, projectId, onDeleteClick }: ProjectProps) => {
  const router = useRouter();
  const { setProject } = useContext(ProjectContext);

  return (
    <div
      className="project-item"
      key={projectId}
      onClick={() => {
        //console.log(`/editor/:${projectId}`);
        setProject({
          id: projectId,
          name: projectTitle,
          description: '',
          pages: [],
          pages_count: projectPages,
        });
        router.navigate(`/editor`);
        //console.log('projectId: ', projectId);
      }}
    >
      <div className="project-text">
        <p className="md-semibold gray-700">{projectTitle}</p>
        <p className="xs-normal gray-500">{projectPages} pages</p>
      </div>
      <div className="action-item" onClick={onDeleteClick}>
        <img src={DeleteIcon} alt="" />
      </div>
      {/* <div className="project-icon">
        <img src={ArrowRightIcon} alt="" />
      </div> */}
    </div>
  );
};

export { ProjectItem };
