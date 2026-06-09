import React, { useState,useEffect, useDebugValue } from 'react';
import RetroEditor from '../RetroEditor/RetroEditor';
import { useAuth } from '../../contexts/authContext';
import { saveLetter,getUserDoc,getDraftLetters } from '../../utils/userDB';
import './WritingPopUp.css'; 
import { data } from 'react-router-dom';
import LetterTray from '../LetterTray/LetterTray';

const WritingPopUp = ({ finished }) => {

  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [username,setUsername] = useState('UNKNOWN')
  const [letterId,setLetterId] = useState(null);
  const [drafts,setDrafts] = useState([]);
  const [loadPopUp,setLoadPopUp] = useState(false);

  //parent content
  const [title,setTitle] = useState('');
  const [content, setContent] = useState('');

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
  },[userId])

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

  const handleLoadEntry = async()=>{
    //FIND USER LETTERS
    console.log('finding user letters')

    if(!userId){
      return;
    }

    try {
      const drafts = await getDraftLetters(userId);
      console.log(drafts);
      setLoadPopUp(true);
      setDrafts(drafts)
    } catch (error) {
      
    }
  };

  const openLetter = (id) => {
    console.log("trying to open:",id)
    for (let index = 0; index < drafts.length; index++) {
      const letter = drafts[index];
      if(letter.letterId === id){
        setContent(letter.content);
        setTitle(letter.title);
        setLetterId(letter.letterId);
      } 
    }
    setLoadPopUp(false);
  };

  return (
    <div className='writing-backdrop'>
      {loadPopUp && (
        <LetterTray letters={drafts} openLetter={openLetter} setLoadPopUp={setLoadPopUp}/>
      )}
      <div className='writing-editor'>
        <button className='close-popup-btn' onClick={finished}>✕</button>
        
        {/* <p className='writing-title'>Who's the lucky person? {username}</p> */}
        {/* <p className='writing-subtitle'>Write your heart out below</p> */}

        <p className='writing-title'>Welcome {username}</p>
        <p className='writing-subtitle'>Write below</p>
        
        <RetroEditor 
          placeholder="USE YOUR IMAGINATION..." 
          onSave={handleSaveEntry} 
          title={title}
          setTitle = {setTitle}
          content ={content}
          setContent = {setContent}
          handleLoadEntry = {handleLoadEntry}
        />
      </div>
    </div>
  );
};

export default WritingPopUp;