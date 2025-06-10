import React from 'react'
import Decore from '../../assets/decore.png'
import {Button} from 'antd'
import Traveller from '../../assets/Traveller 1.png'
import Plane from '../../assets/Plane.png'

const Hero = () => {
  return (
    <div className='pb-1'>
      <div className='relative bg-gray-200 lg:bg-white box-border border-gray-300 rounded-lg shadow-lg lg:border-none lg:shadow-none'>
        {/* Desktop Images - Keep original positioning for lg and xl */}
        <img src={Decore} alt="" className='absolute right-0 hidden lg:flex'/>
        <img src={Traveller} alt="" className='absolute right-0 w-160 h-auto mt-25 mr-35 lg:flex z-40 hidden' />
        <img src={Plane} alt="" className='absolute right-0 w-30 h-auto mt-50 mr-35 hidden lg:flex' />
        <img src={Plane} alt="" className='absolute right-0 w-30 h-auto mt-40 mr-160 hidden lg:flex' />
        
        {/* Mobile/Tablet Background Images */}
        <div className='lg:hidden absolute inset-0 opacity-20'>
          <img src={Traveller} alt="" className='absolute right-2 top-10 w-32 hidden lg:flex sm:w-40 md:w-48 h-auto' />
          <img src={Plane} alt="" className='absolute right-4 top-20 w-8 sm:w-10 md:w-12 h-auto opacity-40' />
        </div>
        
        {/* Content Container */}
        <div className='relative z-10 px-4 sm:px-6 md:px-8 lg:pl-24 pt-20 sm:pt-28 md:pt-32 lg:pt-40 pb-20'>
          {/* Subtitle */}
          <p className="text-orange-600 text-sm sm:text-base lg:text-lg font-extrabold mb-4 text-left tracking-wide">
            BEST DESTINATIONS AROUND SRILANKA
          </p>

          {/* Main Title */}
          <h1
            className="text-[#23263A] text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-left mb-4"
            style={{ fontFamily: 'sans-serif' }}
          >
            Travel,{' '}
            <span className="relative inline-block">
              <span className="font-extrabold underline decoration-[#1AB3FF] decoration-8 underline-offset-[10px]">
                enjoy
              </span>
              <span className="font-extrabold"> and</span>
            </span>
            <br />
            live a new and full life
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-base sm:text-lg font-sans text-left max-w-xl mb-6">
            Built Wicket longer admire do barton vanity itself do in it.<br />
            Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-2">
            <Button
              type="primary"
              className="!bg-[#1AB3FF] !text-white !font-semibold !rounded-lg !px-8 !py-2 !text-base"
              style={{ border: 'none' }}
              size="large"
            >
              Find out More
            </Button>
            <Button
              className="!border-[#1AB3FF] !text-[#1AB3FF] !font-semibold !rounded-lg !px-8 !py-2 !text-base !bg-transparent"
              style={{ borderWidth: 2 }}
              size="large"
            >
              Customized your plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero