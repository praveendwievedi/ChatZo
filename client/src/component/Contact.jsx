import React from 'react'
import Avatar from './Avatar'

function Contact({username,userId,setSelectedUserId,online}) {
  return (
    <div 
    key={userId}
    className='w-full flex items-center '>
    <div 
    className='w-full p-4 border-b-4 border-gray-200 flex items-center gap-2'
    onClick={ e => setSelectedUserId(userId)}
    >
    <Avatar online={online} userName={username} userId={userId} />
    {username}
    </div>
    </div>
  )
}

export default Contact
