import React, { useState,useEffect, useDebugValue } from 'react';
import RetroEditor from '../RetroEditor/RetroEditor';
import { useAuth } from '../../contexts/authContext';
import { saveLetter,getUserDoc } from '../../utils/userDB';
import './WritingPopUp.css'; 
import { data } from 'react-router-dom';

const WritingPopUp = ({ finished }) => {

  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [username,setUsername] = useState('UNKNOWN')
  const [letterId,setLetterId] = useState(null);

  const [title,setTitle] = useState('');

  useEffect(()=>{
    async function fetchUserData(){
    try {
          const userData = await getUserDoc(userId);
          setUsername(userData.username);
          console.log("userdata:",userData);
        } catch (error) {
          console.error(error);
        }
    }
    fetchUserData();
  },userId)

  const handleSaveEntry = async(textData) => {
    console.log("Saving Journal Entry Text:", textData,title);

    if(textData.length === 0 && title.length === 0){
      console.log("no data")
      return false;
    }



    const letterObj = {letterId,username,title,textData,status:"writing"};
    console.log("attempting to save:",letterObj);

    try {
      const saveAttempt = await saveLetter(letterObj,userId);
      setLetterId(saveAttempt);
    } catch (error) {
      console.error(error);
    }
    
    // Perform database writes here if needed, then close the popup
    // if (finished) {
    //   finished();
    // }

    //add saved UI to let user know
  };

  return (
    <div className='writing-backdrop'>
      <div className='writing-editor'>
        <button className='close-popup-btn' onClick={finished}>✕</button>
        
        <p className='writing-title'>Who's the lucky person? {username}</p>
        <p className='writing-subtitle'>Write your heart out below</p>
        
        <RetroEditor 
          placeholder="TYPE YOUR MESSAGE OR LOG ENTRY HERE..." 
          onSave={handleSaveEntry} 
          title={title}
          setTitle = {setTitle}
        />
      </div>
    </div>
  );
};

export default WritingPopUp;