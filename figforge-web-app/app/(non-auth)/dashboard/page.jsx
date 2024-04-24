"use client"
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'
import { useUserProjects } from '@/hooks/useUserProjects';

import ProjectCard from '@/components/project-card'
import { useUser } from '@/context/userContext';
import { addUserToExternalTable } from '@/lib/supabaseFunctions';

import { useSearchParams } from 'next/navigation';

async function pushCode(accessToken, repository, filePath, code) {

    const response = await fetch('http://localhost:3001/push-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accessToken,
        repository,
        filePath,
        content: code
      })
    });
  
    const data = await response.json();
    if (!data.success) {
      console.error('Failed to push code:', data.message);
      return;
    }
  
    console.log('Code pushed successfully:', data.result);
}


export default function DashboardPage() {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { user, setUserToken } = useUser();

    // A lot of supabase calls will be made here
    useEffect(() => {
        if (user) {
            const userUUID = user.id; 
            const userEmail = user.email; 
            addUserToExternalTable(userUUID, userEmail).catch(console.error);
        }
    }, [user]); 

    const { loadingProjects, projects, error } = useUserProjects();
    const { loadingAuth } = useAuth();

    if (loadingAuth || loadingProjects) return <>Getting Projects.....</>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className='py-4 h-screen space-y-8'>
                {/* Always display user ID with option to copy */}
                <p>Welcome <span className="font-semibold">{user?.email.split("@")[0]}</span><br />
                    Here's your figma plugin key: 
                    <span className="ml-1 font-semibold">{user?.id}</span>
                    <span className="ml-2">
                        <button 
                            className="border border-green-500 bg-green-700 rounded px-2 py-1 active:bg-green-500" 
                            onClick={() => navigator.clipboard.writeText(user?.id)}
                        >
                            Copy
                        </button>
                    </span>
                </p>
                
                <div className='space-x-4'>
                    <button 
                        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500' 
                        onClick={() => window.location.href = 'http://localhost:3001/auth/github'}
                    >
                    Connect to Github
                    </button>

                    <button
                        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500'
                        onClick={() => token? pushCode(token, 'asajjad2/test-repo', 'test-file.js', 'console.log("Hello World")') : console.log('No token')}
                    >
                        Push Dummy Code
                    </button>
                </div>
                



                {projects.length === 0 ? (
                    <p>You currently have no projects.</p>
                ) : (
                    <div className='grid grid-cols-3 gap-y-3'>
                        {projects.map((project) => {
                            const { id, name, description, updated_at } = project;

                            return (
                                <ProjectCard 
                                    id={id}
                                    name={name}
                                    description={description}
                                    lastUpdated={updated_at}
                                    key={id}
                                    token={token}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
