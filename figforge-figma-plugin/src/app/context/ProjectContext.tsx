import React, { createContext, useState, ReactNode, useCallback } from 'react';

// Define the structure for individual page data
export interface PageData {
  id: string;
  title: string;
  desktop_frame: JSON;
  tablet_frame: JSON;
  mobile_frame: JSON;
  desktop_external_data: JSON;
  tablet_external_data: JSON;
  mobile_external_data: JSON;
  desktop_grid: boolean;

  created_at: string;
}

// Define the structure for the project data
export interface ProjectData {
  id: string;
  name: string;
  description: string;
  pages: PageData[]; // Adding the pages array
  pages_count: number; // Adding the pages_count field
}

// Define the shape of the context
export interface ProjectContextType {
  project: ProjectData;
  setProject: (project: ProjectData) => void;
  setProjectId: (id: string) => void;
  getProjectId: () => string;
  setPages: (pages: PageData[]) => void; // Function to set pages
}

// Default project data initialization
const defaultProjectData: ProjectData = {
  id: '',
  name: '',
  description: '',
  pages: [], // Initialize as an empty array
  pages_count: 0, // Initialize as zero
};

// Create the context with default values
export const ProjectContext = createContext<ProjectContextType>({
  project: defaultProjectData,
  setProject: (project) => {},
  setProjectId: (id) => {},
  getProjectId: () => '',
  setPages: (pages) => {}, // Initial empty function for setting pages
});

// Define the props for the provider
type ProjectProviderProps = {
  children: ReactNode;
};

// Implement the provider component
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [project, setProject] = useState<ProjectData>(defaultProjectData);

  const setProjectId = (id: string) => {
    setProject((prev) => ({ ...prev, id }));
  };

  const getProjectId = useCallback(() => project.id, [project.id]);

  const setPages = (pages: PageData[]) => {
    setProject((prev) => ({ ...prev, pages, pages_count: pages.length }));
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, setProjectId, getProjectId, setPages }}>
      {children}
    </ProjectContext.Provider>
  );
};
