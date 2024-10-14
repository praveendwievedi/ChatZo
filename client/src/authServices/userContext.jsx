import {createContext,useState,useEffect} from 'react'
import axios from 'axios'

export const userContext=createContext({})

export function UserContextProvider({children}){
     const [user,setUser]=useState({
       id:null,
       userName:null,
       isLogedIn:false
     })
  

     useEffect(()=>{
      axios.get('/user/profile').then((res)=>{
        const {data}=res;
        setUser({
          id:data.id,
          userName:data.userName,
          isLogedIn:true
        })
      })
      .catch((err)=>{
        throw err;
      })
     },[])
  const login=(data)=>{
   
        setUser({
          id:data.id,
          userName:data.userName,
          isLogedIn:true
        })
    
  }

  const logout= ()=>{
        setUser({
          id:null,
          userName:null,
          isLogedIn:false
        })
  }

return(
    <userContext.Provider value={{user,login,logout}}>
    {children}
    </userContext.Provider>
);
}
