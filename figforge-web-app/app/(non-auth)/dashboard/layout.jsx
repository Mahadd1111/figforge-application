"use client"
import React from 'react'
import NavSidebar from '@/components/nav-sidebar'
export default function layout({children}) {
  return (
      <div className='flex flex-1 overflow-hidden'>
        <NavSidebar />
        <div className='flex-1 overflow-auto overflow-y-hidden  '>
          {children}
        </div>
      </div>
  )
}
