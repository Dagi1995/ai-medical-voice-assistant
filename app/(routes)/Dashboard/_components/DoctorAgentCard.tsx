import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type doctorAgent={
    id:number,
    specialty:string,
    description:string,
    image:string,
    agentPrompt:string

}
type Props={ 
    doctorAgent:doctorAgent
}

function DoctorAgentCard({doctorAgent}:Props) {
  return (
    <div>
      <Image src={doctorAgent.image} alt={doctorAgent.specialty} width={200} height={100} className='w-20 h-20 object-cover rounded-full'/>
      <h3 className='font-semibold text-lg mt-2'>{doctorAgent.specialty}</h3>
      <p className='text-gray-600 mt-1'>{doctorAgent.description}</p>
      <Button className='w-50 mt-2'> Start Consultation </Button>
    </div>
  )
}

export default DoctorAgentCard
