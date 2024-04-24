"use client"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import { useRouter } from 'next/navigation'


function daysAgo(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const timeDiff = today - date; 
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); 
    return daysDiff;
}

function truncateString(str) {
    return str.substring(0, 22) + '...';
}

export default function ProjectCard({id, name, lastUpdated, description, token}){

    const router = useRouter();

    lastUpdated = daysAgo(lastUpdated.split(" ")[0]);
    const handleClick = () => {
        router.push(`/sandbox/${id}?token=${token}`)
    }


    return (
        <div onClick={handleClick}>
            <Card className="w-[340px] h-40  flex flex-col justify-between  bg-slate-700 text-white cursor-pointer border-none hover:bg-slate-600 transition duration-300 ease-in-ou">
                <CardHeader className="text-left space-y-3">
                    <div className="flex justify-between">
                        <CardTitle>{name.length > 15? truncateString(name) : name}</CardTitle>
                        <FeatherIcon className="inline-block" icon={'chevron-down'}/>
                    </div>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <p>{lastUpdated > 0? lastUpdated + "d ago": "Today"}</p>
                </CardFooter>
            </Card>
        </div>
        
    )
   
}