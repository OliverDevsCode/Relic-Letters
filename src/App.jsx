import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/homePage/homePage' 
import { AuthProvider } from './contexts/authContext';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 2. Now HomePage and any child elements (like GameSketch) can safely use useAuth() */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App