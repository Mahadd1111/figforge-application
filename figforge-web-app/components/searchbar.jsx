"use client"
import React from 'react'
import { Search } from 'feather-icons-react/build/IconComponents'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from 'components/ui/button'

export default function Searchbar({ className, ...props}, ref) {

  const [searchQuery, setSearchQuery] = React.useState('')
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    setSearchQuery('')
  }, [pathName, searchParams])

  return (
    
    <div className='relative'>
        <div className="py-[10px] px-[14px] rounded-[8px] bg-slate-900  flex items-center justify-center gap-2">
            <Search 
                className="text-gray-400"
                size={20}
            />
            <input 
                type="text" 
                placeholder="Search "
                className="w-[545px] bg-transparent focus:outline-none"
                {...props}
                // when user clicks enter
            />
        </div>
        {/* {
            searchQuery.length > 0 && 
            <SearchDropDown value={searchQuery} router={router}/>
        } */}
    </div>
    
  )
}
