import React,{useContext,useEffect, useState} from 'react'
import Register from './Register'
import {userContext} from '../authServices/userContext'
import axios from 'axios'
import ChatPage from './ChatPage'

function Routes() {
  const {user}=useContext(userContext)
  // const [userData,setUserData]=useState('')
  
  // const logOut=()=>{
  //   logout()
  // }

   if(user.isLogedIn){
    return (
      <ChatPage />
    )
   }
   else{
  return (
    <Register />
  )
 }
}

export default Routes
