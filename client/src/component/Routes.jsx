import React,{useContext,useEffect, useState} from 'react'
import Register from './Register'
import {userContext} from '../authServices/userContext'
import axios from 'axios'
import ChatPage from './ChatPage'

function Routes() {
  const {user}=useContext(userContext)
   if(user.isLogedIn){
    // console.log(user);
    
    
    return (
      <ChatPage currentUser={user}/>
    )
   }
   else{
  return (
    <Register />
  )
 }
}

export default Routes
