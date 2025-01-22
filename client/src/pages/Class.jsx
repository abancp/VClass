import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import Header from '../components/main/Header'
import NoticeBoard from '../components/main/NoticeBoard'
import Sidebar from '../components/main/Sidebar'
import CreateWorkPopup from '../components/popup/CreateWorkPopup'
import { SERVER_URL } from '../config/SERVER_URL'

function ClassPage() {
  const [classData, setClassData] = useState({})
  const { id } = useParams()
  const [showSidebar, setShowSidebar] = useState(false)
  const [selected, setSelected] = useState('class')
  const [typedAnnounce, setTypedAnnounce] = useState()
  const [showWorkPopup, setShowWorkPopup] = useState(false)
  const [works, setWorks] = useState([])
  const [worksSkip, setWorksSkip] = useState(0)
  const [peoples, setPeoples] = useState({ students: [], teachers: [] })
  const [anns, setAnns] = useState([])
  const [annSkip, setAnnSkip] = useState(0)

  useEffect(() => {
    axios.get(SERVER_URL + "/class/" + id, { withCredentials: true })
      .then(({ data }) => {
        console.log(data)
        setClassData(data.class)
      })

    if (selected === "peoples" && peoples.length === 0) {
      axios.get(SERVER_URL + "/class/peoples/" + id, { withCredentials: true })
        .then(({ data }) => {
          console.log(data)
          setPeoples(data.peoples)
        })
    }
  }, [id, selected, peoples])

  useEffect(() => {
    if (selected !== "works") return
    axios.get(SERVER_URL + "/work/works/" + id + "?skip=" + worksSkip, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        console.log("Fetched works")
        setWorks((p) => [...p, ...data.works])
      }
    })
  }, [worksSkip, id, selected])
  useEffect(() => {
    axios.get(SERVER_URL + "/ann/anns/" + id + "?skip=" + annSkip, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        console.log("Fecthed anns")
        setAnns((p) => [...p, ...data.anns])
      }
    })
  }, [annSkip, id])

  const handleWorksScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    console.log(offsetHeight, scrollTop, scrollHeight)
    if (offsetHeight + scrollTop === scrollHeight) {
      setWorksSkip(works.length)
    }
  }
  const handleAnnsScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    console.log(offsetHeight, scrollTop, scrollHeight)
    if (offsetHeight + scrollTop === scrollHeight) {
      setAnnSkip(works.length)
    }
  }

  const handleAnnounce = (e) => {
    e.preventDefault()
    axios.post(SERVER_URL + "/ann",
      { announce: typedAnnounce, class_id: id }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setTypedAnnounce("")
          console.log("Announced")
        }
      })
  }


  return (
    <div   className={`w-full flex-grow text-light pt-header ${showSidebar ? "pl-[15rem]" : "pl-[3rem]"} min-h-screen bg-dark transition-all duration-300`}>
      <Header sub={classData.name} forWhat="class" handleMenuClick={() => { setShowSidebar((prev) => !prev) }} />
      {showWorkPopup && <CreateWorkPopup id={id} handleClose={() => { setShowWorkPopup(false) }} />}
      <Sidebar selected={selected} handleChange={(type) => setSelected(type)} full={showSidebar} forWhat={"class"} classname={classData.name} />
      {selected === "class" &&
        <main className='p-4 flex gap-8 justify-center items-start'>
          <div  className='w-[15rem] p-3 rounded-md flex flex-col gap-3 h-[9.4rem] border border-tersiory/50'>
            <div className='flex flex-col justify-center items-start justify-between'>
              <h1 className=" text-lg font-semibold">Class Key</h1>
              <div className='flex items-center gap-2 text-tersiory cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                </svg>
                <h1 className=" text-lg font-semibold">  copy invite link</h1>
              </div>
            </div>
            <h1 className='text-2xl bg-secondery rounded-md py-3 w-full text-center font-bold'>{classData.key}</h1>
          </div>
          <div  onScroll={handleAnnsScroll}  className='w-[48rem] flex flex-col gap-3'>
            <NoticeBoard notices={[{ notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" },
            { notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" }
            ]} />
            <form onSubmit={handleAnnounce} className='bg-secondery flex gap-1 justify-center items-center w-full rounded-md border border-tersiory/50  p-1'>
              <input name="announce" value={typedAnnounce} onChange={(e) => { setTypedAnnounce(e.target.value) }} placeholder='Type to announce something ..' className='w-full bg-transparent/50 border rounded-md p-1 focus:outline-none border-tersiory/50' />
              <button type='submit' className=''>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-send rounded-md  cursor-pointer ${typedAnnounce ? "text-tersiory/70 hover:text-tersiory" : "text-dark "} duration-300 `} viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
              </button>
            </form>

            {
              anns.map((ann) => (
                <div className=' flex flex-col gap-1 w-full rounded-md  border border-tersiory/50  p-4'>
                  <h1 className='font-semibold' >{ann.user_id}<span className='ml-2 opacity-90 text-sm font-thin'>{ann.time}</span> </h1>
                  {ann.announce}
                </div>
              ))
            }
          </div>
        </main>
      }


      {
        selected === 'works' &&
        <div className='w-full flex flex-col gap-2 justify-between p-3 min-h-[calc(100vh-3.5rem)] '>
          <div onScroll={handleWorksScroll} className='gap-3 flex flex-col h-[calc(100vh-9.9rem)] p-3 overflow-y-scroll  w-full'>
            {
              works.map((work) => (
                <div className='rounded-md w-full p-2 border border-tersiory/50 bg-secondery/50'>
                  <h1 className='font-semibold text-lg'>{work.title}</h1>
                  <h3 className=''>{work.instruction}</h3>
                  <div className='flex gap-3 mt-1 px-2 text-tersiory/90 '>
                    <h6 className='font-light text-[14px]'>Aban Muhammed C P</h6>
                    <div className=' px-[4px]  text-light border border-tersiory/70 bg-tersiory/30 flex justify-center items-center text-xs rounded-full'>assignment</div>
                    <h6 className='font-light text-[14px]' >12/2/2025 12:20</h6>
                  </div>
                </div>
              ))
            }
          </div>
          <div onClick={() => { setShowWorkPopup((p) => (!p)) }} className='cursor-pointer hover:text-tersiory duration-300 h-[4rem] gap-3 rounded-md w-full flex bg-secondery items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
            <h1 className='text-2xl'>Create</h1>
          </div>
        </div>
      }

      {
        selected === 'peoples' &&
        <main className='p-4 flex flex-col gap-2 mb-2 justify-center items-start' >
          <h1 className='text-x py-2 rounded-md border border-tersiory px-4 font-bold'>Teachers</h1>
          {
            peoples?.teachers?.map((teacher) => (
              <div className='py-2 w-[20rem] ml-4 px-4 text-lg rounded-md bg-secondery'>{teacher}</div>
            ))
          }
          <h1 className='text-x  py-2 rounded-md border border-tersiory px-4 font-bold'>Students</h1>
          {
            peoples?.students?.map((student) => (
              <div className='py-2 w-[20rem] ml-4 px-4 text-lg rounded-md bg-secondery'>{student}</div>
            ))
          }

        </main>
      }
    </div>
  )
}

export default ClassPage
