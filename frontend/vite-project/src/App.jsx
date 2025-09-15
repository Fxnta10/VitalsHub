import { use, useState } from 'react'
import React from 'react'
import { useEffect } from 'react'
import {Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import {Toaster} from "react-hot-toast"
import MyProfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import { useAuthStore } from './stores/useAuthStore'
function App() {
  const{authUser,checkAuth,isCheckingAuth} = useAuthStore()
  useEffect(() => {
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return <h1>Loading...</h1>
  }
  return (
   <div>
    <Navbar/>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/myprofile" element={<MyProfile/>} />
      <Route/>
    </Routes>
    <Toaster/>
   </div>
  )
}

export default App
