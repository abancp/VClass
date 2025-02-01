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
  const [showWork, setShowWork] = useState(false)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const [fileLink,setFileLink] = useState()
  const [workid,setWorkid] = useState()

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

  const handleSubmitWork = (e)=>{
    axios.post(SERVER_URL+"/work",{})
  }

  

  return (
    <div className='w-full flex flex-col gap-2 justify-between p-3 min-h-[calc(100vh-3.5rem)] '>


      {(showWorkPopup && role === "teacher" && !showWork) && <CreateWorkPopup id={id} handleClose={() => { setShowWorkPopup(false) }} />}
      {!showWork &&
        <div onScroll={handleWorksScroll} className={`gap-3 flex flex-col overflow-y-scroll p-3 ${role === "teacher" ? "h-[calc(100vh-10rem)]" : "h-[calc(100vh-5rem)]"} w-full`}>
          {
            works.map((work) => (
              <div className='rounded-2xl w-full p-2 border-tersiory/50 bg-secondery/50'>
                <h1 onClick={() => { setShowWork(true) }} to={"/class/" + id + "/" + work.type + "/" + work._id.$oid} className='font-semibold text-lg cursor-pointer hover:text-tersiory w-fit'>{work.title}</h1>
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
        </div>}
      {(!showWork && role === "teacher") &&
        <div onClick={() => { setShowWorkPopup((p) => (!p)) }} className='cursor-pointer hover:text-tersiory duration-300 h-[4rem] gap-3 rounded-md w-full flex bg-secondery items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          <h1 className='text-2xl'>Create</h1>
        </div>
      }

      {showWork &&
        <>
          <h1 className='text-2xl w-full text-center font-semibold'>Assignment 1</h1>
          <div className='border-t border-tersiory w-full'></div>
          <div className='px-5 overflow-y-scroll h-[calc(100vh-12.9rem)]'>
            <div>must submit as pdf</div>
          </div>
          <div className='flex w-full justify-center'>
            <div className={`rounded-2xl flex flex-col text-lg duration-200 items-center justify-end gap-1 p-1 ${showFileUploader?"h-[4.3rem]":"h-[2.3rem]"} bg-secondery/50`}>
              {showFileUploader && <div className={` ${showFileUploader ? "h-[2rem]" : "h-0"} duration-300 flex justify-center`}>
                <input value={fileLink} onChange={(e)=>setFileLink(e.target.value)} placeholder='paste link here..' className='bg-dark  h-full focus:outline-none px-1 rounded-2xl'/>
              </div>}
              <div className='flex'>
                <div onClick={() => { setShowFileUploader((p) => !p) }} className='gap-2 px-2 flex items-center duration-300 hover:bg-dark/60 cursor-pointer rounded-2xl '>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-paperclip text-tersiory" viewBox="0 0 16 16">
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                  </svg>
                  add file</div>
                <div onClick={handleSubmitWork} className='gap-2 px-2 bg-secondery/60 flex items-center duration-300  hover:bg-secondery cursor-pointer rounded-2xl'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle-fill text-green-800" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                  mark as done</div>
              </div>
            </div>
          </div>
        </>

      }
    </div>

  )
}

export default Works
