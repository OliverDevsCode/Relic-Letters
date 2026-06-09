import React, { useState } from 'react';
import './RetroEditor.css';

const RetroEditor = ({ onSave, placeholder = "WRITE YOUR LEGEND HERE..." }) => {
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(content);
    }
  };

  return (
    <div className="retro-editor-container">
      <div className="editor-header">
        <span>📜 Your parchment</span>
        <span className="editor-status">QUILL: READY</span>
      </div>
      
      <form onSubmit={handleFormSubmit} className="editor-form">
        <textarea
          className="retro-textarea"
          placeholder={placeholder}
          value={content}
          onChange={handleTextChange}
          maxLength={1000}
          name="journal-entry"
          autoComplete="off"
          spellCheck="false"
        />
        
        <div className="editor-footer">
          <span className="char-counter">Character remaining: {charCount}/1000</span>
          <button type="submit" className="editor-save-btn">
            Save Letter
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetroEditor;