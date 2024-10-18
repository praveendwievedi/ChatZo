import React from 'react'

function DefaultPage() {
  return (
    <div className='w-full h-full flex items-center justify-center'> 
       <div className=' text-gray-500 font-bold flex items-center gap-1'>
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
       </svg>
        <span>Select user from side bar to chat</span> </div>
    </div>
  )
}

export default DefaultPage
