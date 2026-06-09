import React, { useEffect, useState } from 'react';
import './LetterCard.css'

const LetterCard = ({id,title,date,sender,openLetter}) => {
  const [displayDate,setDisplayDate] = useState('');
  useEffect(()=>{
    const readable = new Date(date).toLocaleDateString();
    setDisplayDate(readable)
  },[date])

  function handleOpen(){
    openLetter(id);
  }

  return (
    <div className='letter-card'>
      <p>{title}</p>
      <p>{sender}</p>
      <p>{displayDate}</p>
      <button onClick={handleOpen}>Open</button>
    </div>
  )
}

export default LetterCard