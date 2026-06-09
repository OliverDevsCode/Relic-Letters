import React from "react";
import './RetroDrawer.css';

const RetroDrawer = ({ isOpen, letters = [], onSelectLetter,close }) => {
  return (
    <div className={`drawer-housing ${isOpen ? 'open' : ''}`}>
      
      <div className="drawer-interior-cavity">
        
        <div className="drawer-letter-rack">
          {letters.map((letter) => {
            const displayTitle = letter.title || "UNTITLED";
            
            return (
              <div 
                key={letter.letterId || letter.id} 
                className="pixel-letter-tab" 
                onClick={() => onSelectLetter && onSelectLetter(letter.letterId || letter.id)}
              >
                <span>✉️</span>
                <small>
                  {displayTitle.length > 8 
                    ? `${displayTitle.substring(0, 7)}...` 
                    : displayTitle}
                </small>
              </div>
            );
          })}
        </div>

      </div>

      <div className="drawer-faceplate">
        <div className="pixel-brass-handle" onClick={close}></div>
      </div>

    </div>
  );
};

export {RetroDrawer} ;