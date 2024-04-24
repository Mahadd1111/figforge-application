"use client"
import React, {useState} from 'react'
import FeatherIcon from 'feather-icons-react/build/FeatherIcon'

const SidebarItem = ({item, onClick, active, type}) => {
    return (
        <div className="px-6 py-2 rounded-[6px] space-x-3 hover:text-white text-gray-400 font-medium text-xs flex items-center cursor-pointer"
            onClick={onClick}
        >
            <h3 className={active?'text-white':''}>{item.page_name}</h3>
            {
                active ? 
                <FeatherIcon className="inline-block" icon={"chevron-right"} size={12} color={'white'}
                />
                : null
            }
        </div>
    )
}

export default function ProjectSidebar({projectPages, changeFile}) {

    const [currentPage, setCurrentPage] = useState(0);
    console.log(projectPages)

  return (
    <div className='pb-8 mx-4 min-w-[19vw] h-full flex flex-col justify-between '>
        <header className='space-y-6'>
            <div className="header-items">
            {
                projectPages.map((item, index) => {

                    const active = currentPage === index;

                    return (
                        <SidebarItem key={index} item={item} active={active} onClick={()=>{
                            changeFile(index)
                            setCurrentPage(index)
                        }}/>
                    )
            })}
            
            </div>
        </header>
        <footer>
        <div className="header-items">
            <SidebarItem item={{icon: "settings", text: "Settings"}}/>
            <SidebarItem item={{icon: "log-out", text: "Logout"}}/>
        </div>
        </footer>
    </div>
  )
}
