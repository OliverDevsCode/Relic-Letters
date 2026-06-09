import React from 'react';
import RetroEditor from '../RetroEditor/RetroEditor';
import './WritingPopUp.css'; 

const WritingPopUp = ({ finished }) => {
  
  const handleSaveEntry = (textData) => {
    console.log("Saving Journal Entry Text:", textData);
    
    // Perform database writes here if needed, then close the popup
    if (finished) {
      finished();
    }
  };

  return (
    <div className='writing-backdrop'>
      <div className='writing-editor'>
        <button className='close-popup-btn' onClick={finished}>✕</button>
        
        <p className='writing-title'>Who's the lucky person?</p>
        <p className='writing-subtitle'>Record your logs below</p>
        
        <RetroEditor 
          placeholder="TYPE YOUR MESSAGE OR LOG ENTRY HERE..." 
          onSave={handleSaveEntry} 
        />
      </div>
    </div>
  );
};

export default WritingPopUp;