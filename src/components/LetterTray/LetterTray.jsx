import React from 'react'
import './LetterTray.css'
import LetterCard from '../LetterCard/LetterCard'

const LetterTray = ({letters,openLetter,setLoadPopUp}) => {
  return (
    <div className='letter-tray'>
      <p>Previous Letters</p>
      {letters.map((data)=>(
        <LetterCard
          key={data.letterId || data.id}
          id={data.letterId}
          title={data.title}
          date={data.date}
          sender={data.sender}
          openLetter={openLetter}
        />
      ))}
     <button className='close-popup-btn' onClick={()=>{setLoadPopUp(false)}}>✕</button>
    </div>
  )
}

export default LetterTray