import React from 'react'

function Avatar({userId , userName,
  className=''
}) {
   const colors=['bg-purple-200','bg-blue-200',
                 'bg-teal-200','bg-red-200',
                 'bg-pink-200','bg-sky-200'];

   const userIdBaseof10=parseInt(userId,16)
   const colorIndex=(userIdBaseof10 % colors.length)
   
   const color=colors[colorIndex]
  //  console.log({userId,userName});
   

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color} ${className}`}>
      <div>
        {userName[0].toUpperCase()}
      </div>
    </div>
  )
}

export default Avatar
