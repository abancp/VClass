import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ClassGrid from '../components/main/ClassGrid'
import Footer from '../components/main/Footer'
import Header from '../components/main/Header'
import Landing from '../components/main/Landing'
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
              <div className='w-[60] min-h-screen'>
                <ClassGrid publicClasses classes={publicClasses} />
              </div>
              :

              <Landing />
        :
        <Landing />
      }
    </div >
  )
}

export default Home
