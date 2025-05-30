import React from 'react'
import Decore from '../../assets/decore.png'
import {Button} from 'antd'
import Traveller from '../../assets/Traveller 1.png'
import Plane from '../../assets/Plane.png'

const Hero = () => {
  return (
    <div >
     <div className='relative'>
        <img src={Decore} alt="" className='absolute right-0 right-'/>
        <img src={Traveller} alt="" className='absolute right-0 w-160 h-auto mt-25 mr-40 z-40' />
        <img src={Plane} alt="" className='absolute right-0 w-30 h-auto mt-50 mr-40' />
        <img src={Plane} alt="" className='absolute right-0 w-30 h-auto mt-40 mr-160' />
        <div className='pl-24 pt-40'>
            <p className='text-orange-600 font-extrabold font-popins'>BEST DESTINATION AROUND SRI LANKA</p>
            <p className='text-7xl w-110 font-extrabold' style={{fontFamily:"sans-serif"}}>Travel, enjoy and live a new and full life</p>
            <p className='w-110 font-popins'>Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.</p>
            <div className='mt-10'>
                <Button type='primary' style={{height:45, width:150}}>Find Out More</Button>
                <Button style={{height:45, marginLeft:10}}>Customize your plane</Button>
            </div>
        </div>
     </div>
      
    </div>
  )
}

export default Hero
