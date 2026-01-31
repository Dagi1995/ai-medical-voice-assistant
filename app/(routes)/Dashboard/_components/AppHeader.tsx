import React from 'react'
import Image from 'next/image'
import { option } from 'motion/react-client'


const menuOptions = [

    {
        id:1,
        name:"Home",
        path:"/home"
    },
    {
        id:2,
        name:"History",
        path:"/history"
    },
    {
        id:3,
        name:"Pricing",
        path:"/pricing"
    },
    {
        id:4,
        name:"Profile",
        path:"/profile"
    },
]
function AppHeader() {
  return (
    <div className='flex  items-center  justify-between p-4 shadow px-10 md:px-20 lg:px-40 xl:px-60'>
      <Image src={"/logo.svg"} alt="App Logo" width={40} height={20} />
      <div className='w-full h-16 hidden md:flex items-center justify-center gap-12'  >
        {menuOptions.map((option, index) => (
            <div key={index}>
                <h2 className='cursor-pointer transition duration-300 hover:-translate-y-1 hover:font-bold'> {option.name}</h2>
                </div> 
        ))}
      </div>
    </div>
  )
}

export default AppHeader
