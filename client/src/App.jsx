import React from 'react'
import axios from 'axios'
import {UserContextProvider} from './authServices/userContext'
import Routes from './component/Routes'
import {ToastContainer} from 'react-toastify'

function App() {
  axios.defaults.baseURL='http://localhost:3000'
  axios.defaults.withCredentials=true

  return (
    <UserContextProvider>
      <Routes />
      <ToastContainer />
    </UserContextProvider>
    
  );

}
export default App
