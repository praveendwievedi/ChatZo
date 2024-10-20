import React from 'react'
import axios from 'axios'
import {UserContextProvider} from './authServices/userContext'
import Routes from './component/Routes'
// import {ToastContainer} from 'react-toastify'

function App() {
  axios.defaults.baseURL=import.meta.env.VITE_API_URL || 'http://localhost:3000';
  axios.defaults.withCredentials=true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
    
  );

}
export default App
