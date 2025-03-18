import React from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import InfiniteScroll from '../sub/InfiniteScroll'

function Landing() {
  return (
    <div className='w-full  h-full '>
      <div className='flex flex-col mb-[5rem] mt-[10rem] p-[2rem] mx-[15rem]  gap-3'>
        <div className='shadow-[44px_35px_100px_50px_#1192B8] w-[3rem]'></div>
        <h1 className='text-light  text-5xl font-semibold'>VClass</h1>
        <h1 className='text-light text-xl font-extralight'>Ai Powered Virtual Classroom </h1>
      </div>
      <InfiniteScroll />
      <div className=''>

      </div>
    </div >
  )
}

export default Landing
