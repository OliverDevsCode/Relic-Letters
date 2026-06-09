import React, { useState } from 'react';
import './RetroEditor.css';

const RetroEditor = ({ onSave, placeholder = "USE YOUR IMAGINATION...", title,setTitle,content,setContent,handleLoadEntry}) => {
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const updateTitleChange =(e) =>{
    const text = e.target.value;
    setTitle(text);
  }

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
        <input
          type="text"
          className="retro-title-input"
          placeholder="ENTER TITLE..."
          value={title}
          onChange={updateTitleChange}
          maxLength={100}
          name="journal-title"
          autoComplete="off"
          spellCheck="false"
        />
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
          <button type="button" className="editor-load-btn" onClick={handleLoadEntry}>
            Load Letter
          </button>
          <button type="submit" className="editor-save-btn">
            Save Letter
          </button>
        </div>
      </form>
    </div>
  );
};

export default RetroEditor;