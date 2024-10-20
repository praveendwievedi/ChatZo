import React,{useContext,useEffect, useState} from 'react'
import Register from './Pages/Register'
import {userContext} from '../authServices/userContext'
import axios from 'axios'
import ChatPage from './Pages//ChatPage'

function Routes() {
  const {user}=useContext(userContext)
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
