import React from 'react';
import ReactDOM from 'react-dom'; // 1. Import ReactDOM
import './LetterPopUp.css';

const LetterPopUp = ({ letter, closeLetter }) => {
  console.log("Showing letter:", letter);
  
  if (!letter || !letter.title) return null; // Ensure we have a valid letter object

  const formatDate = (dateString) => {
    console.log("date:",dateString)
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  return ReactDOM.createPortal(
    <div className="letter-modal-overlay" onClick={closeLetter}>
      <div className="letter-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-letter-btn" onClick={closeLetter} aria-label="Close letter">
          &times;
        </button>

        <article className="letter-paper">
          <header className="letter-header">
            <span className="letter-date">{formatDate(letter.createdAt)}</span>
          </header>

          <main className="letter-body">
            <h2 className="letter-main-title">{letter.title}</h2>
            <p className="letter-content">{letter.content}</p>
          </main>

          <footer className="letter-footer">
            <p className="letter-valediction">Sincerely,</p>
            <p className="letter-sender">{letter.sender ?? letter.senderName ?? "Unknown Sender"}</p>
          </footer>
        </article>

      </div>
    </div>,
    document.body 
  );
};

export default LetterPopUp;