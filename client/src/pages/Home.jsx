import React from 'react'
import ClassGrid from '../components/main/ClassGrid'
import Footer from '../components/main/Footer'
import Header from '../components/main/Header'
import InfiniteScroll from '../components/sub/InfiniteScroll'
import useStore from '../store/store'

function Home() {

  const state = useStore((state) => state)

  return (
    <div className='w-ful flex flex-col justify-start items-center max-h-fit pb-[2rem] min-h-screen pt-header bg-dark'>
      <Header forWhat="home" />
      {state.username ?
        <div className='w-[60] min-h-screen'>
          <ClassGrid />
        </div> :
        <div className='w-full  h-full '>
          <div className='flex flex-col ml-[10rem] mt-[10rem] mb-[5rem] gap-3'>
            <div className='shadow-[44px_35px_100px_50px_#1192B8] w-[3rem]'></div>
            <h1 className='text-light  text-5xl font-semibold'>VClass</h1>
            <h1 className='text-light text-xl font-extralight'>Ai Powered Virtual Classroom </h1>
          </div>
          <InfiniteScroll />
        </div>
      }
      <Footer />
    </div>
  )
}

export default Home
