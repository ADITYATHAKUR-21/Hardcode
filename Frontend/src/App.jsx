import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './page/HomePage'
import SignUpPage from './page/SignUpPage'
import LoginPage from './page/LoginPage'


function App() {
  let authUser = null;
  

  return (
    <>
     <div className='flex flex-col items-center justify-center text-4xl'>

     <Routes>
      <Route
      path = '/'
      element = {authUser ? <HomePage/> : <Navigate to = '/login'/>}
      />

      <Route
      path = '/signup'
      element = {!authUser ? <SignUpPage/> : <Navigate to =  '/'/>}
      />

     <Route
     path ='/login'
     element = {!authUser ? <LoginPage/> : <Navigate to = '/' /> }
     />
     
     
     </Routes>

     </div>
    </>
  )
}

export default App
