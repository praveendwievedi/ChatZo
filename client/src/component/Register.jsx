import React, { useState,useContext } from 'react'
import axios from 'axios'
import {userContext} from '../authServices/userContext'

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
    <div className='bg-blue-50 h-screen w-sreen flex items-center'>
    <div className="w-80 relative flex flex-col p-4 rounded-md text-black bg-white mx-auto">
      <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">Welcome<span className="text-[#7747ff] px-1">{loggedInstatus === 'login' ? 'back' : ''} 😃</span></div>
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
      <input type="text"
       
       className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
       name='password'
       value={password}
       onChange={(e)=>(setPassword(e.target.value))} />     
      </div>
    <button 
    type="submit" 
    className="bg-blue-400 w-max m-auto px-6 py-2 rounded text-white text-sm font-normal">
    {loggedInstatus === 'register' ? 'Register' : 'Log In'}</button>

    </form>
    {loggedInstatus === 'register' && 
      <div className='mt-3 text-center'>
      Already a member? <button className='text-blue-400 px-2 hover:cursor-pointer' onClick={e => setLoggedInStatus('login')}>Sign In</button>
     </div>
    }

    {loggedInstatus === 'login' && 
      <div className='mt-3 text-center'>
      Yet not a member? <button className='text-blue-400 px-2 hover:cursor-pointer' onClick={ e => setLoggedInStatus('register')}>Register</button>
     </div>
    }

    </div>
    </div>
  )
}

export default Register
