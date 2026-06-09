import React from 'react'
import LoginCard from '../LoginCard/LoginCard'
import SignUpCard from '../SignUpCard/SignUpCard'
import './AuthPopUp.css'

const AuthPopUp = ({ onClose }) => {
  return (
    <div className="retro-modal-overlay">
      <div className='auth-pop-up'>
        
        <p className='auth-header'>Welcome Home</p>
        <p className='auth-desc'>Please choose from the following:</p>
        
        <div className="auth-cards-container">
          <LoginCard onSuccess={onClose}/>
          <SignUpCard onSuccess={onClose}/>
        </div>

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

export default AuthPopUp