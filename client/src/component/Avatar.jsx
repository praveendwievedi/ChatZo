import React from 'react'

function Avatar({userId , userName,
  online
}) {
   const colors=['bg-purple-200','bg-blue-200',
                 'bg-teal-200','bg-red-200',
                 'bg-pink-200','bg-sky-200'];

   const userIdBaseof10=parseInt(userId,16)
   const colorIndex=(userIdBaseof10 % colors.length)
   
   const color=colors[colorIndex]
  //  console.log({userId,userName});
   

  return (
    <div className={`w-8 h-8 relative rounded-full flex items-center justify-center ${color}` }>
      <div>
        {userName[0].toUpperCase()}
      </div>
      {online &&
      (<div className='w-3 h-3 absolute rounded-full bg-green-500 border border-white bottom-0 right-0 '></div>)
      }
      { !online &&
      (<div className='w-3 h-3 absolute rounded-full bg-gray-500 border border-white bottom-0 right-0 '></div>)
      }
    </div>
  )
}

export default Avatar
