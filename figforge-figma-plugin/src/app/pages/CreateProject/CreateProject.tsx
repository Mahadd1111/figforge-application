import React, { useState } from 'react';
//import { useRouter } from '../../context/RouterContext';
import { TextArea, TopHeader, Button, InputField } from '../../components/index';
import './CreateProject.css';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';
import { useRouter } from '../../context/RouterContext';

export default function CreateProject() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    max_width:1440, 
    globalStyles: false,
    components: false,
  });

  //const router = useRouter();
  const { userData, setUserData } = useUser();

  const handleSubmit = async () => {
    let { data, error } = await supabase.rpc('add_project', {
      components_enabled: formData.components,
      global_styles_enabled: formData.globalStyles,
      project_description: formData.description,
      project_name: formData.title,
      user_id: userData?.user_id, 
      m_width:formData.max_width
    });

    if (error) console.error(error);
    else console.log(data);

    setUserData({
      email: userData?.email,
      user_id: userData?.user_id,
      is_authenticated: userData?.is_authenticated,
      projects: [
        ...userData?.projects,
        {
          project_id: data[0].project_id,
          project_name: formData.title,
          page_count: 0,
        },
      ],
    });

    router.navigate('/projects')
  };

  return (
    <div>
      <TopHeader title="Create New Project" back />
      <div className="main-content">
        <InputField
          label="Project Ttitle"
          placeholder="Enter project title"
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
          maxLenght={25}
        />
        <TextArea
          label="Project Description"
          placeholder="Add a description"
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
          }}
        />
        <InputField
          label="Project Max Width"
          type='number'
          placeholder="Enter project desktop width"
          onChange={(e) => {
            setFormData({ ...formData, max_width: parseInt(e.target.value, 10) });
          }}
        />
      </div>
      <div className="cta-btn">
        <Button children="Create Project" size="lg" type="primary" width="w-full" onClick={handleSubmit} />
      </div>
    </div>
  );
}

/* import { supabase } from '../../supabaseClient';

async function createProject(projectData: {
  project_name: string;
  project_description: string;
  components_enabled: boolean;
  global_styles_enabled: boolean;
}): Promise<void> {
  try {
    const { data, error } = await supabase.rpc('create_project', projectData);

    if (error) throw error;

    // Handle the response data as needed
    console.log('Project created successfully:', data);
  } catch (error) {
    console.error('Error creating project:', error);
    // Handle or throw the error as needed
  }
}

export default createProject;
 */
