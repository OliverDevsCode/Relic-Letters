import React,{useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage/HomePage' 
import LegalPage from './components/LegalPage/LegalPage';
import { AuthProvider } from './contexts/authContext';

import { messaging } from './utils/firebaseConfig';
import { onMessage } from 'firebase/messaging';
import { showToast ,Toaster  } from './utils/inAppNotifications';


function App() {

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      showToast(payload);
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App