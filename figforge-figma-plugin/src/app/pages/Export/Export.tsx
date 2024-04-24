import React, { useEffect, useState,useContext } from "react"
import { HashLoader } from "react-spinners"
import { ProjectContext } from '../../context/ProjectContext';
import { useUser } from '../../context/UserContext';
import { useRouter } from "../../context/RouterContext";
import axios from "axios";
import "./Export.css"

const Export=()=>{
    const router = useRouter()
    console.log("At Export page")
    const [loading,setLoading] = useState(true)
    const { project } = useContext(ProjectContext);
    const { userData } = useUser();
    const project_id = project?.id
    const user_id = userData?.user_id || '';
    const url = "http://localhost:8000/api/generate-code/"
    // const redirect_url = 'https://figforge-web.vercel.app/signin'
    const redirect_url = 'http://localhost:3000/signin'
    const postData = async (project_id, user_id) => {
        try {
          const response = await axios.post(url, {
            project_id: project_id,
            user_id: user_id,
          });
      
          console.log('Response:', response.data);
          setLoading(false)
        } catch (error) {
          console.error('Error:', error);
        }
      };
    useEffect(()=>{
        postData(project_id, user_id);
    },[])

    function goToProjects(){
        router.navigate('/projects')
    }
    return(
        <div className="export-container">
            {
                loading?(
                    <div className="loading-container">
                        <h1 className="heading">Please Wait While Your Code is Generated</h1>
                        <HashLoader color="#36d7b7" />
                    </div>
                ):(
                    <div className="loading-container">
                        <h1 className="heading">Your Code Has Generated</h1>
                        <div className="btn-container">
                            <button className="back-btn" onClick={()=>goToProjects()}>Back to Projects</button>
                            <a className="redirect-btn" href={redirect_url} target="_blank">See Code</a>  
                        </div>
                        
                    </div>
                )
            }
        </div>
    )
}

export default Export