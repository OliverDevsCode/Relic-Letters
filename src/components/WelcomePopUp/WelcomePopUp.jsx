import React from 'react';
import LetterPopUp from '../LetterPopUp/LetterPopUp';
import { useAuth } from '../../contexts/authContext';
import './WelcomePopUp.css';

const WelcomePopUp = ({ onClose }) => {

  const {currentUser} = useAuth();

  let letter = {};

  if(currentUser?.uid == import.meta.env.VITE_SECRET_UID){
    letter = {
    title: import.meta.env.VITE_WELCOME_TITLE,
    content: import.meta.env.VITE_WELCOME_MESSAGE,
    date: Date.now(), 
    senderName: "Oliver"
    };
  }else{
    letter = {
    title: "Welcome to Relic Letters",
    content: "Have fun exploring and writing letters",
    date: Date.now(), 
    senderName: "Oliver"
    };
  }

  

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