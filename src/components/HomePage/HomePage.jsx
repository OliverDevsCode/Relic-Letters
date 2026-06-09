import React from 'react'
import GameSketch from '../GameSketch' 
import './HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className='title-container'>
        <h1>Welcome to Rustic Letters</h1>
      </div>
      <div className="game-wrapper-box">
        <GameSketch />
      </div>
    </div>
  )
}

export default HomePage