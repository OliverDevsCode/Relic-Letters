import React, { useEffect, useState } from 'react';
import { getDeliveredLetters,collectLetters } from '../../utils/postFunctions';
import LetterCard from '../LetterCard/LetterCard';
import { notifyUserToast, attemptToast } from '../../utils/inAppNotifications';
import './CollectLetterPopUp.css';
import { timestampAdd } from 'firebase/firestore/pipelines';

const CollectLetterPopUp = ({ userId, onClose ,setCollecting}) => {
  const [deliveredLetters, setDeliveredLetters] = useState([]);

  useEffect(() => {
    async function fetchLetters() {
      if (userId) {
        console.log(`fetching letters for user: ${userId}`);
        const letters = await getDeliveredLetters(userId);
        console.log('letters:', letters);
        setDeliveredLetters(letters);
      }
    }
    fetchLetters();
  }, [userId]);

  const handleOpen = () =>{
    notifyUserToast("Very Eager!","Unfortunately you need to get home to do that! \n Collect them first!")
  }

  const handleCollect = async() => {
    if(!userId || deliveredLetters.length === 0){
      console.log("No userId or letters to collect");
      return;
    }
    const letterIds = deliveredLetters
    .map(letter => {
      const targetId = letter?.id || letter?.letterId;
      return targetId ? String(targetId) : null;
    })
    .filter(id => id !== null && id !== 'undefined');

    if (letterIds.length === 0) {
    console.error("Aborting collection: No valid string IDs could be parsed.");
    return;
    }

    const collectPromise = collectLetters(userId,letterIds);
    attemptToast({title:"Collected",message:"Gathered with me own paws",promise:collectPromise});
    try {
      const status = await collectPromise;
      console.log("Batch collection status:", status);
    
      setCollecting(false);
  } catch (error) {
    console.error("Failed to complete mail collection route execution:", error);
  }
  };

  return (
    <div className='popup-backdrop'>
      <div className='letter-tray' onClick={(e) => e.stopPropagation()}>
        
        <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 16px 0' }}>
          <span>Your Postbox [Arrived Items]</span>
          <span className='retro-close' onClick={()=>{setCollecting(false)}} style={{ cursor: 'pointer' }}>
            [X]
          </span>
        </p>

        <div className="letter-tray-scrollable">
          {deliveredLetters.length === 0 ? (
            <p className="no-mail-text">Your mailbox is empty. No carriers have arrived yet.</p>
          ) : (
            deliveredLetters.map((letter) => (
              <div key={letter.id || letter.letterId} className="collect-card-wrapper">
                <LetterCard
                  id={letter.id || letter.letterId}
                  title={letter.title}
                  date={letter.deliveredAt}
                  sender={letter.sender || letter.senderName}
                  openLetter={handleOpen}
                />
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        
          {deliveredLetters.length > 0 && (
            <button 
              className='send-button' 
              onClick={handleCollect}
              style={{ marginTop: 0, marginLeft: 'auto', width: 'auto', minWidth: '160px' }}
            >
              Collect All Mail
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CollectLetterPopUp;