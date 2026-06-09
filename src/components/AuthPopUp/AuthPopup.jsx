import React from 'react'
import LoginCard from '../LoginCard/LoginCard'
import SignUpCard from '../SignUpCard/SignUpCard'
import './AuthPopup.css' // Ensure the CSS is explicitly linked!

const AuthPopup = ({ onClose }) => {
  return (
    /* 1. Backdrop container anchoring the layout position context */
    <div className="retro-modal-overlay">
      <div className='auth-pop-up'>
        
        {/* Optional: Add a Close 'X' button or manual panel button if needed */}
        <p className='auth-header'>Welcome Home</p>
        <p className='auth-desc'>Please choose from the following:</p>
        
        {/* 2. Flex Row wrapper separating forms cleanly */}
        <div className="auth-cards-container">
          <LoginCard onSuccess={onClose}/>
          <SignUpCard onSuccess={onClose}/>
        </div>

        {/* 3. Add a footer exit action button */}
        <button 
          onClick={onClose} 
          className="reset-button" 
          style={{ marginTop: '24px', background: 'var(--social-bg)' }}
        >
          Return to Map (As Guest)
        </button>

      </div>
    </div>
  )
}

export default AuthPopup