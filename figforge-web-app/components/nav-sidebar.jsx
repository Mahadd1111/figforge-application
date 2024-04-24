"use client"
import React from 'react'
import FeatherIcon from 'feather-icons-react/build/FeatherIcon'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase'

const headerItems = [
    {
        icon: "clock",
        text: "Recent",
        path: "/"
    }, {
        icon: "users",
        text: "Shared with me",
        path: ""
    },  
]

const SidebarItem = ({item, router, handleClick}) => {
    return (
        <div className="px-3 py-2 rounded-[6px] space-x-3 hover:text-white text-gray-400 font-medium text-base flex cursor-pointer"
            onClick={handleClick?handleClick:()=>router.push(item.path)}
        >
            {item.icon?
            <FeatherIcon className="inline-block" icon={item.icon}/>:
            null}
            <h3 className=''>{item.text}</h3>
        </div>
    )
}

export default function NavSidebar() {

    const router = useRouter();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if(error) console.log(error)
        else
            router.push('/')
    }

  return (
    <div className='py-8 mx-4 min-w-[19vw] h-full flex flex-col justify-between '>
        <header className='space-y-6'>
            
            <div className="header-items">{
                headerItems.map((item, index) => <SidebarItem key={index} item={item} router={router}/>)
            }</div>
        </header>
        <footer>
        <div className="header-items">
            <SidebarItem item={{icon: "settings", text: "Settings"}}/>
            <SidebarItem item={{icon: "log-out", text: "Logout"}} handleClick={signOut}/>
        </div>
        </footer>
    </div>
  )
}
