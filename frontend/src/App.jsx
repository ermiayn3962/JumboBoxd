// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom'
// import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn, Navigate } from "@clerk/clerk-react";


function App() {


  return (
    <Routes>
      {/* <Route path='/' element={<Navigate to='/sign-in'/>}/> */}
      <Route path='/' element={<HomePage/>}/>
      <Route path="/sign-in/" element={<SignInPage />} />
      <Route path="/sign-up/" element={<SignUpPage />} />
      {/* <Route path="/home" element={
        <>
          <SignedIn><HomePage /></SignedIn>
          <SignedOut><Navigate to="/sign-in" /></SignedOut>
        </>
      } /> */}
    </Routes>
  )
}

export default App
