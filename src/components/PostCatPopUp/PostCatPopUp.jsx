import React, { useState,useEffect, use } from 'react';
import PostLetterPopUp from '../PostLetterPopUp/PostLetterPopUp';
import CollectLetterPopUp from '../CollectLetterPopUp/CollectLetterPopUp';
import { getUserDoc } from '../../utils/userDB';
import { useAuth } from '../../contexts/authContext';
import './PostCatPopUp.css';
import { mapRemove } from 'firebase/firestore/pipelines';

const PostCatPopUp = ({ onClose }) => {
  const [prioSpeech, setPrioSpeech] = useState("Please choose from the following");
  const [posting,setPosting] = useState(false);
  const [collecting,setCollecting] = useState(false);
  const [username,setUsername] = useState('');
  const [userId,setUserId] = useState('');

  const { currentUser } = useAuth();
  

  useEffect(()=>{
    async function getUserInfo(){
      if(currentUser){
        const uid = currentUser.uid
        setUserId(uid);
        const response = await getUserDoc(uid);
        setUsername(response.username);
      }
    }
    //meow hello
    const meow = new Audio('./audio/meow-1.mp3');
    meow.play();
    getUserInfo()
  },[])
  

  const handlePostClick = () => {
    setPrioSpeech("Purr-fect! Let's get that letter sorted.");
    setPosting(true);
    // setTimeout(() => {
    //   if (onPostLetter) onPostLetter();
    // }, 800);
  };

  const handleCheckClick = () => {
    setPrioSpeech("Let me check the cubbyholes for you...");
    setCollecting(true);
    // setTimeout(() => {
    //   if (onCheckPost) onCheckPost();
    // }, 800);
  };

  return (
    <div className='post-cat-backdrop'>
      {posting && (
        <PostLetterPopUp setPosting={setPosting} username={username} onClose={onClose}/>
      )}
      {collecting && (
        <CollectLetterPopUp setCollecting={setCollecting} userId={userId}/>
      )}
      <div className='post-cat-editor'>
        {/* Top corner quick-exit layout element */}
        <button className='close-popup-btn' onClick={onClose}>
          X
        </button>

        <h1 className='post-cat-title'>Welcome to my purrst office!</h1>
        <h2 className='post-cat-subtitle'>My name is Prio</h2>
        {/* BELOW = PRODUCTION VERSION */}
        {/* <h2 className='post-cat-subtitle'>Meow you doin’ {username}</h2> */}
        <h2 className='post-cat-subtitle'>Meow you doin’ Luthor</h2>
        
        {/* Prio the Cat Visual Element */}
        <div className='post-cat-avatar-container'>
          <img 
            src="/postcat.gif" 
            alt="Prio the Post Office Cat" 
            className='post-cat-gif'
            onError={(e) => {
              e.target.style.display = 'none';
              console.error("Could not find postcat.gif in public folder");
            }}
          />
        </div>

        {/* Dynamic Dialogue Prompt Text */}
        <p className='post-cat-speech'>{prioSpeech}</p>
        
        {/* Action Controls */}
        <div className='post-cat-actions'>
          <button className='post-cat-btn' onClick={handlePostClick}>
            ✉️ Post Letter
          </button>
          <button className='post-cat-btn' onClick={handleCheckClick}>
            📦 Check Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCatPopUp;