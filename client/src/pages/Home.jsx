import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ClassGrid from '../components/main/ClassGrid'
import Footer from '../components/main/Footer'
import Header from '../components/main/Header'
import InfiniteScroll from '../components/sub/InfiniteScroll'
import { SERVER_URL } from '../config/SERVER_URL'
import useStore from '../store/store'

function Home() {
  const [classes, setClasses] = useState([])
  const [publicClasses, setPublicClasses] = useState([])

  useEffect(() => {
    axios.get(SERVER_URL + "/class/classes", { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        console.log(data)
        setClasses(data.classes)
      }
    })
    axios.get(SERVER_URL + "/class/public/classes", { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        console.log(data)
        setPublicClasses(data.classes)
      }
    })
  }, [])



  const state = useStore((state) => state)
  const [tab, setTab] = useState("personal")

  return (
    <div className='w-ful flex flex-col justify-start items-center max-h-fit pb-[2rem] min-h-screen pt-header bg-dark'>
      <Header forWhat="home" tab={tab} setTab={(t) => { setTab(t) }} />
      {state.username ?
        tab === "personal" ?
          <div className='w-[60] min-h-screen'>
            <ClassGrid classes={classes.filter(classItem => classItem.public === false)} />
          </div>
          : tab === "joined" ?
            <div className='w-[60] min-h-screen'>
              <ClassGrid classes={classes.filter(classItem => classItem.public === true)} />
            </div>
            :
            tab === "public" ?
              < div className='w-[60] min-h-screen'>
                <ClassGrid publicClasses classes={publicClasses} />
              </div>
              :
              <div className='w-full  h-full '>
                <div className='flex flex-col ml-[10rem] mt-[10rem] mb-[5rem] gap-3'>
                  <div className='shadow-[44px_35px_100px_50px_#1192B8] w-[3rem]'></div>
                  <h1 className='text-light  text-5xl font-semibold'>VClass</h1>
                  <h1 className='text-light text-xl font-extralight'>Ai Powered Virtual Classroom </h1>
                </div>
                <InfiniteScroll />
              </div>

        :
        <div className='w-full  h-full '>
          <div className='flex flex-col ml-[10rem] mt-[10rem] mb-[5rem] gap-3'>
            <div className='shadow-[44px_35px_100px_50px_#1192B8] w-[3rem]'></div>
            <h1 className='text-light  text-5xl font-semibold'>VClass</h1>
            <h1 className='text-light text-xl font-extralight'>Ai Powered Virtual Classroom </h1>
          </div>
          <InfiniteScroll />
        </div>
      }
    </div >
  )
}

export default Home
