import React, { useState,useContext } from 'react'
import axios from 'axios'
import {userContext} from '../authServices/userContext'
import '../App.css'
import Logo from './Logo'

function Register() {
  const [userName,setUserName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loggedInstatus,setLoggedInStatus]=useState('register')

   const {login,user}=useContext(userContext)
  const handleSUbmit= (e)=>{
    e.preventDefault();
 
   if(loggedInstatus === 'register'){
    axios.post('/user/register',{userName,email,password}).then((response)=>{
     const {data}=response;
       login(data)
    })
    .catch((err)=>{
      throw err;
    })
   }
   else{
    axios.post('/user/login',{email,password}).then((response)=>{
      const {data}=response;
      login(data)
     })
     .catch((err)=>{
       throw err;
     })
   }
  }


  return (
   <div className='bg-red-50 h-screen w-sreen flex justify-center items-center'>
     <div className='bg-red-100 backdrop-blur-lg rouded w-1/3 flex justify-center items-center p-4 rounded-md'>
      <div className="w-[90%] relative flex flex-col p-4 rounded-md text-black bg-white mx-auto">
      <div className='flex flex-col items-center p-2'>
      <div className='w-full flex items-center justify-center'>
         <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={0.1} stroke="currentColor" className="size-12">
       <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
         </svg>
         <h2 className='Logo text-red-500 font-bold text-xl'>
         ChatZo
         </h2>
      </div>
      <div>
        <p className='Logo text-[8px] text-red-500 font-bold'>Connect.Chat.Share.Instantly.</p>
      </div>
      </div>
      <div className="text-3xl font-bold mb-2 text-[#1e0e4b] text-center">Welcome<span className="text-red-500 px-1">{loggedInstatus === 'login' ? 'back' : ''} 👋</span></div>
       <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">{loggedInstatus === 'register' ? 'Sign up to create your account' : 'Login  to your account'}</div>
      <form className="flex flex-col gap-3" onSubmit={handleSUbmit}>
      {loggedInstatus === 'register' && 
        <div className="block relative"> 
      <label className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Username</label>
      <input type="text" 
    
      className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"
      name='userName'
      value={userName}
      onChange={(e)=>(setUserName(e.target.value))} />
      </div>
      }

      <div className="block relative"> 
      <label  className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Email</label>
      <input type="text"
       className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"
       name='email'
       value={email}
       onChange={(e)=> (setEmail(e.target.value))} />
    
      </div>
      <div className="block relative"> 
      <label 
       className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2">Password</label>
      <input type="password"
       
       className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
       name='password'
       value={password}
       onChange={(e)=>(setPassword(e.target.value))} />     
      </div>
    <button 
    type="submit" 
    className="bg-red-500 hover:bg-red-600 w-max m-auto px-6 py-2 rounded text-white text-sm font-normal">
    {loggedInstatus === 'register' ? 'Register' : 'Log In'}</button>

    </form>
    {loggedInstatus === 'register' && 
      <div className='mt-3 text-center'>
      Already a member? <button className='text-red-500 hover:underline px-2 hover:cursor-pointer' onClick={e => setLoggedInStatus('login')}>Sign In</button>
     </div>
    }

    {loggedInstatus === 'login' && 
      <div className='mt-3 text-center'>
      Yet not a member? <button className='text-red-500 hover:underline px-2 hover:cursor-pointer' onClick={ e => setLoggedInStatus('register')}>Register</button>
     </div>
    }

      </div>
    </div>
   </div>
  )
}
 
export default Register
