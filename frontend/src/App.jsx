import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut} from '@clerk/clerk-react'


function App() {
  return (
    <Routes>
      <Route path="/" element={
        <>
        <SignedIn>
          <Navigate to="/home"/>
        </SignedIn>

        <SignedOut>
          <Navigate to='sign-in'/>
        </SignedOut>
        </>
      } />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/home/*" element={
        <>
          <SignedIn>
           <HomePage/>
          </SignedIn>

          <SignedOut>
            <Navigate to='sign-in'/>
          </SignedOut>
        </>
      } />
    </Routes>
  )
}

export default App