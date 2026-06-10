import React, { useState } from 'react'
import GameSketch from '../GameSketch' 
import AuthPopUp from '../AuthPopUp/AuthPopUp'
import WritingPopUp from '../WritingPopUp/WritingPopUp';
import DrawerPopUp from '../DrawerPopUp/DrawerPopUp';
import PostCatPopUp from '../PostCatPopUp/PostCatPopUp';
import './HomePage.css'

const HomePage = () => {
  const [activeModal, setActiveModal] = useState(null)

  return (
    <div className="homepage-container">
      <div className='title-container'>
        <h1>Welcome to Relic Letters</h1>
      </div>
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
        </div>
      )}
    </div>
  )
}

export default HomePage