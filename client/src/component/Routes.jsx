import React,{useContext,useEffect} from 'react'
import Register from './Register'
import {userContext} from '../authServices/userContext'
import axios from 'axios'

function Routes() {
  const {setUserName,setId}=useContext(userContext)
  
  useEffect(()=>{
    axios.get('/user/profile').then((res)=>{
      
      const {data}=res;
      setUserName(data.userName)
      setId(data.id)
    })
    .catch((err)=>{
      if(err)throw err;
    })
  },[])

  return (
    <Register />
  )
}

export default Routes
