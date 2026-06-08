import React from 'react'
import GameSketch from '../GameSketch' 
import './HomePage.css'

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1>Welcome to Rustic Letters</h1>
      <GameSketch />
    </div>
  )
}

export default HomePage