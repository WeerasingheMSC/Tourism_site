import React from 'react'
import DecoreImg from '../../assets/Decore.png'

const Decore: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 z-[-10] pointer-events-none">
      <img 
        src={DecoreImg} 
        alt="Decore" 
        className="block w-auto h-auto"
        style={{
          transform: 'scale(0.75)',
          transformOrigin: 'top right'
        }}
      />
    </div>
  )
}

export default Decore