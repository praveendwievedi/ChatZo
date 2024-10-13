import React,{useContext,useEffect, useState} from 'react'
import Register from './Register'
import {userContext} from '../authServices/userContext'
import axios from 'axios'

function Routes() {
  const {userName,id,userStatus,setUserStatus,logout}=useContext(userContext)
  const [userData,setUserData]=useState('')
  
  const logOut=()=>{
    logout()
  }

   if(userStatus === 'loggedin'){
    return (
      <div>
      <p>Welcome 😃!! {userName} </p>
      <button className='bg-blue-400 rounded-md px-2 py-4' onClick={logOut}>Logout</button>
      </div>
    )
   }
   else{
  return (
    <Register />
  )
 }
}

export default Routes
