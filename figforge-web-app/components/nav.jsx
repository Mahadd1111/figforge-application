"use client"
import React from 'react'
import SearchBar from './searchbar'
import Image from 'next/image'
import NavLogo from 'public/nav-logo.svg'
import { useRouter } from 'next/navigation'

import { useUser } from '@/context/userContext'

export default function Nav({img, name}) {


    const { user } = useUser()
    const avatar = user?.user_metadata?.avatar_url
    const router = useRouter()

  return (
    <div className='w-full px-8 py-6 flex items-center'>
        <div className='w-[19vw]' onClick={()=>{
            router.push("/")
        }}>
            <Image 
                src={NavLogo}
                alt="Nav Logo"
                width={127}
                height={60}
                objectFit='cover'
                className='px-3 cursor-pointer'
            />
        </div>
        <div className='flex flex-1 justify-between'>
            <SearchBar />
            <img src={avatar} alt={name} 
                className='rounded-full bg-gray-400'
                width={40}
                height={40}
            />
        </div>
       
    </div>
  )
}
