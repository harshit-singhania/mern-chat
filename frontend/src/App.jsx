import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import LogoutPage from './pages/LogoutPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { axiosInstance } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
 
const App = () => {
  const [ authUser ] = useAuthStore()
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={ <HomePage/> }/>
        <Route path='/signup' element={ <SignUpPage/> }/>
        <Route path='/login' element={ <LoginPage/> }/>
        <Route path='/logout' element={ <LogoutPage/> }/>
        <Route path='/settings' element={ <SettingsPage/> }/>
        <Route path='/profile' element={ <ProfilePage/> }/>
      </Routes>
    </div>
  )
}

export default App