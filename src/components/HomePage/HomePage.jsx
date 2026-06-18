import React, { useEffect, useState } from 'react'
import GameSketch from '../GameSketch' 
import AuthPopUp from '../AuthPopUp/AuthPopUp'
import WritingPopUp from '../WritingPopUp/WritingPopUp';
import DrawerPopUp from '../DrawerPopUp/DrawerPopUp';
import PostCatPopUp from '../PostCatPopUp/PostCatPopUp';
import NotificationBox from '../NotificationBox/NotificationBox';
import SecretPopUp from '../SecretPopUp/SecretPopUp';
import WelcomePopUp from '../WelcomePopUp/WelcomePopUp';
import { useAuth } from '../../contexts/authContext';
import './HomePage.css'

const HomePage = () => {
  const [activeModal, setActiveModal] = useState(null)
  const [welcome,setWelcome] = useState(true);

  const {currentUser,userLoggedIn} = useAuth();


  useEffect(()=>{
    if(currentUser?.uid === import.meta.env.VITE_SECRET_UID || !userLoggedIn){
      setWelcome(true);
    }else{
      setWelcome(false);
    }
  },[])


  return (
    <div className="homepage-container">
      <div className='title-container'>
        {userLoggedIn && (
          <h1>Relic Letters</h1>
        )}
        {!userLoggedIn && (
          <h1>Welcome to Relic Letters</h1>
        )}
      </div>
      {welcome && (
      <WelcomePopUp onClose={setWelcome}/>
      )}
      <div className="game-wrapper-box">
        <GameSketch activeModal={activeModal} setActiveModal={setActiveModal} />
      </div>

      {activeModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          pointerEvents: "auto"
        }}>
          {activeModal === "AUTH_REQUIRED" && (
            <AuthPopUp onClose={() => setActiveModal(null)} />
          )}

          {activeModal === "WRITE_COMPONENT" && (
            <WritingPopUp finished={() => setActiveModal(null)}/>
          )}

          {activeModal === "DRAWER_COMPONENT" && (
            <DrawerPopUp finished={() => setActiveModal(null)}/>
          )}

          {activeModal === "POSTCAT_COMPONENT" && (
            <PostCatPopUp onClose={() => setActiveModal(null)}></PostCatPopUp>
          )}
          {activeModal === "NOTIFICATION_COMPONENT" && (
            <NotificationBox onClose={() => setActiveModal(null)}></NotificationBox>
          )}
          {activeModal === "SECRET_COMPONENT" && (
            <SecretPopUp onClose={() => setActiveModal(null)}></SecretPopUp>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage