import {createContext,useState,useEffect} from 'react'
import axios from 'axios'

export const userContext=createContext({})

export function UserContextProvider({children}){
     const [userName,setUserName]=useState('')
     const [id,setId]=useState('')
     const [userStatus,setUserStatus]=useState('')

    //  const login=()=>{
    //     setUserStatus('loggedin')
    //  }

  

  const login=()=>{
    axios.get('/user/profile').then((response)=>{
        const {data}=response;
        setUserName(data.userName)
        setId(data.id)
        setUserStatus('loggedin')
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  const logout= ()=>{
    axios.get('/user/logout').then((response)=>{
        const {data}=response;
        setUserName('')
        setId('')
        setUserStatus('loggedout')
    })
    .catch((err)=>{
      console.log(err);
    })
  }

return(
    <userContext.Provider value={{userName,setUserName,id,setId,userStatus,setUserStatus,login,logout}}>
    {children}
    </userContext.Provider>
);
}
