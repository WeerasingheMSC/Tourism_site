import React from 'react'
import Decore from '../../assets/decore.png'
import {Button} from 'antd'
import Traveller from '../../assets/Traveller 1.png'
import Plane from '../../assets/Plane.png'

const Hero = () => {
  return (
    <div className='pb-1' >
     <div className='relative  bg-gray-200 lg:bg-white'>
        <img src={Decore} alt="" className='absolute right-0 hidden lg:flex'/>
        <img src={Traveller} alt="" className='absolute right-0 w-160 h-auto mt-25 mr-35 z-40 hidden lg:flex' />
        <img src={Plane} alt="" className='absolute right-0 w-30 h-auto mt-50 mr-35 hidden lg:flex' />
        <img src={Plane} alt="" className='absolute right-0 w-30 h-auto mt-40 mr-160 hidden lg:flex' />
        <div className='pl-5 md:pl-24 pt-40'>
            <p className='text-orange-600 text-xs text-center md:text-lg font-extrabold font-popins md:text-start lg:text-start'>BEST DESTINATION AROUND SRI LANKA</p>
            <p className='text-4xl md:text-7xl w-110 font-extrabold mt-8 text-center md:text-start lg:text-start' style={{fontFamily:"sans-serif"}} >Travel, enjoy and live a new and full life</p>
            <p className='w-110 text-sm md:text-lg text-center font-sans md:text-center lg:text-start'>Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.</p>
            <div className='mt-10 md: ml-0'>
                <Button type='primary' style={{height:45, width:150}}>Find Out More</Button>
                <Button style={{height:45, marginLeft:10}}>Customize your plane</Button>
            </div>
        </div>
     </div>
      
    </div>
  )
}

export default Hero
