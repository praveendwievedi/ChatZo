import React from 'react'
import Register from './component/Register'
import axios from 'axios'
// import {userContext} from './authServices/userContext'

function App() {
  axios.defaults.baseURL='http://localhost:3000'
  axios.defaults.withCredentials=true

  return (
    <Register />
  )
}

export default App
