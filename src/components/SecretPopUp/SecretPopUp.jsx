import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import './SecretPopUp.css';
import {sendLetter } from '../../utils/userDB';

const SecretPopUp = ({onClose}) => {

  const [hiddenMessage,setHiddenMessage] = useState({})

  const {currentUser,userLoggedIn} = useAuth();


  useEffect(()=>{
    if(currentUser?.uid === import.meta.env.VITE_SECRET_UID){
      parseHidden();
      //play fanfare
      const fanfare = new Audio('./audio/fanfare.mp3');
      fanfare.volume = 0.4;
      fanfare.play();
    }else{
      const fanfare = new Audio('./audio/fanfare.mp3');
      fanfare.volume = 0.4;
      fanfare.play();
      const message = {title: "HEY WHAT ARE YOU DOING HERE",body:"Congratulations on finding the relic of ruins! I hope you enjoy the experience and happy writing!"}
      setHiddenMessage(message);
    }
  },[])

  function parseHidden() {
    try {
      const b64String = import.meta.env.VITE_SECRET_MESSAGE;
      
      if (b64String) {
        // 1. Decode the Base64 string back into a standard JSON text string
        const decodedText = atob(b64String);
        
        // 2. Turn that JSON string back into a workable JavaScript Object
        const parsedObject = JSON.parse(decodedText);
        
        setHiddenMessage(parsedObject);
      }
    } catch (error) {
      console.error("Error decoding the secret message:", error);
    }
  }


  return (
    <div className='secret-backdrop'>
      <div className='secret-pop-up'>
        <button className='close-btn' onClick={onClose}>X</button>
        {userLoggedIn && (
          <>
          <h3>{hiddenMessage.title || "System Message"}</h3>
          <p>{hiddenMessage.body || "Loading encrypted packet..."}</p>
        </>
        )}
        {!userLoggedIn && (
          <>
          <p>Hey you need to be logged in for this!</p>
          </>
        )}
        
      </div>
    </div>
  );
}

export default SecretPopUp