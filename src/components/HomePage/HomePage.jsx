import React, { useState } from 'react'
import GameSketch from '../GameSketch' 
import AuthPopUp from '../AuthPopUp/AuthPopUp'
import WritingPopUp from '../WritingPopUp/WritingPopUp';
import DrawerPopUp from '../DrawerPopUp/DrawerPopUp';
import './HomePage.css'

const HomePage = () => {
  const [activeModal, setActiveModal] = useState(null)

  return (
    <div className="homepage-container">
      <div className='title-container'>
        <h1>Welcome to Rustic Letters</h1>
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

          {activeModal === "POST_OFFICE" && (
            <div className="retro-modal-overlay">
              <div className="retro-modal-content">
                <h2>Post Office</h2>
                <p>Welcome to the local sorting office!</p>
                <button onClick={() => setActiveModal(null)} className="counter">Leave Office</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage