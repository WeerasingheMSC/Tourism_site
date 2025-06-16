import React from 'react'
import DecoreImg from '../../assets/Decore.png'

const Decore: React.FC = () => {
  return (
    <div className="relative w-full h-full z-0">
      <img src={DecoreImg} alt="Decore" className="absolute right-0 z-0" />
    </div>
  )
}

export default Decore