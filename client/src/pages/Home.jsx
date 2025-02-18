import React from 'react'
import ClassGrid from '../components/main/ClassGrid'
import Footer from '../components/main/Footer'
import Header from '../components/main/Header'

function Home() {
  return (
    <div className='w-ful flex flex-col justify-start items-center max-h-fit min-h-screen pt-header bg-dark'>
      <Header forWhat="home" />
      <div className='w-[60] min-h-screen'>
        <ClassGrid />
      </div>
      <Footer />
    </div>
  )
}

export default Home
