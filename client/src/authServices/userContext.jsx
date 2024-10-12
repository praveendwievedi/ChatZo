import {createContext,useState} from 'react'

export const userContext=createContext({})

export function UserContextProvider({children}){
     const {userName,setUserName}=useState('')
     const {id,setId}=useState('')

return(
    <userContext.Provider value={{userName,setUserName,id,setId}}>
    {children}
    </userContext.Provider>
);
}
