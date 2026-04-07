"use client"

import React, { useState } from 'react'
import Image from 'next/image'
// If you are using shadcn/ui, update the import path as follows:
import { Button } from "@/components/ui/button";

function HistoryList() {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div className='mt-10'>
      {historyList.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-5 p-7 border border-dashed rounded-2xl'> 
          <Image className=''src="/image copy.png" alt="No History" width={250} height={200} />
          <h2 className=' font-bold text-xl mt-2'>No Recent Consultation</h2>
          <p className=''>It looks like you have't consulted with any doctors yet.</p>
          <Button className='mt-3'>+Start a Consultation</Button>
        </div>
      ) : (
        <div>list</div>
      )}
    </div>
  )
}

export default HistoryList
