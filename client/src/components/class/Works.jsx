import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import CreateWorkPopup from '../popup/CreateWorkPopup'
import { Link } from 'react-router'

function Works({ id, role }) {
  const [works, setWorks] = useState([])
  const [worksSkip, setWorksSkip] = useState(0)
  const [workFetch, setWorkFetch] = useState(false)
  const [showWorkPopup, setShowWorkPopup] = useState(false)

  useEffect(() => {
    if (workFetch && worksSkip === 0) {
      return
    }
    axios.get(SERVER_URL + "/work/works/" + id + "?skip=" + worksSkip, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        setWorkFetch(true)
        console.log("Fetched works", works)
        setWorks((p) => [...p, ...data.works])
      }
    })
  }, [worksSkip, workFetch, id])

  const handleWorksScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    console.log(offsetHeight, scrollTop, scrollHeight)
    if (offsetHeight + scrollTop === scrollHeight) {
      setWorksSkip(works.length)
    }
  }

  return (
    <div className='w-full flex flex-col gap-2 justify-between p-3 min-h-[calc(100vh-3.5rem)] '>
      {(showWorkPopup && role === "teacher") && <CreateWorkPopup id={id} handleClose={() => { setShowWorkPopup(false) }} />}
      <div onScroll={handleWorksScroll} className={`gap-3 flex flex-col overflow-y-scroll p-3 ${role === "teacher" ? "h-[calc(100vh-10rem)]" : "h-[calc(100vh-5rem)]"} w-full`}>
        {
          works.map((work) => (
            <div className='rounded-2xl w-full p-2 border-tersiory/50 bg-secondery/50'>
              <Link to={"/class/" + id + "/" + work.type + "/" + work._id.$oid} className='font-semibold text-lg cursor-pointer hover:text-tersiory w-fit'>{work.title}</Link>
              <div className='flex gap-3 mt-1  text-tersiory/90 '>
                <h6 className='font-light text-[14px]'>{work.teacher_name}</h6>
                <div className=' px-[4px]  text-light border border-tersiory/70 bg-tersiory/30 flex justify-center items-center text-xs rounded-full'>{work.type}</div>
                <h6 className='font-light text-[14px]' >{new Date(work.time).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                })}</h6>
              </div>
            </div>
          ))
        }
      </div>
      {role === "teacher" &&
        <div onClick={() => { setShowWorkPopup((p) => (!p)) }} className='cursor-pointer hover:text-tersiory duration-300 h-[4rem] gap-3 rounded-md w-full flex bg-secondery items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          <h1 className='text-2xl'>Create</h1>
        </div>
      }
    </div>

  )
}

export default Works
