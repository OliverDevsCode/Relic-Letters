import React from 'react';
import LetterPopUp from '../LetterPopUp/LetterPopUp';
import './WelcomePopUp.css';

const WelcomePopUp = ({ onClose }) => {

  const letter = {
    title: import.meta.env.VITE_WELCOME_TITLE,
    content: import.meta.env.VITE_WELCOME_MESSAGE,
    date: Date.now(), 
    senderName: "Oliver"
  };

  const handeClose = () =>{
    onClose(false);
  };

  return (
    <div className="welcome-overlay">
        <LetterPopUp letter={letter} closeLetter={handeClose} ></LetterPopUp>
    </div>
  );
};

export default WelcomePopUp;