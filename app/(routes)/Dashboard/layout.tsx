import React from 'react'
import AppHeader from './_components/AppHeader';

function DashboardLayout(
    {
  children,
}: Readonly<{
  children: React.ReactNode;
}>
    
) {
  return (
    <div>
     <AppHeader/>
     <div className='py-10 px-10 md:px-20 lg:px-40 xl:px-60'> 
       {children}
     </div>
     
    </div>
  )
}

export default DashboardLayout
