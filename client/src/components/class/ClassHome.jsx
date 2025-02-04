import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../config/SERVER_URL'
import { toast } from 'sonner'
import { QRCode } from 'react-qrcode-logo'
import NoticeBoard from '../main/NoticeBoard'

function ClassHome({ id, classData, role }) {

  const [showQRCode, setShowQRCode] = useState(false)
  const [typedAnnounce, setTypedAnnounce] = useState()
  const [anns, setAnns] = useState([])
  const [annSkip, setAnnSkip] = useState(0)

  useEffect(() => {
    axios.get(SERVER_URL + "/ann/anns/" + id + "?skip=" + annSkip, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        console.log("Fecthed anns")
        setAnns((p) => [...p, ...data.anns])
      }
    })
  }, [annSkip, id])

  const handleAnnsScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    console.log(offsetHeight, scrollTop, scrollHeight)
    if (offsetHeight + scrollTop === scrollHeight) {
      setAnnSkip(anns.length)
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

  const handleCopyJoinUrl = () => {
    navigator.clipboard.writeText(window.document.location.origin + "/join?name=" + classData.name + "&key=" + classData.key)
    toast.success("Copied to Clipboard!")
  }
  const refetchAnns = () => {
    axios.get(SERVER_URL + "/ann/anns/" + id + "?skip=0", { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        setAnnSkip(0)
        setAnns(data.anns)
      }
    })
  }


  return (
    < main className='p-4 flex gap-8 justify-center items-start' >
      {role === "teacher" &&
        < div className={`w-[15rem] transition-all ${showQRCode ? "h-[24.5rem]" : "h-[9.9rem]"} p-3 rounded-md flex flex-col gap-3 duration-100 border border-tersiory/50`}>
          <div className='flex gap-2 flex-col justify-center items-start justify-between'>
            <h1 className=" text-lg font-semibold">Class Key</h1>
            <div className='flex justify-between items-center w-full'>
              <div onClick={handleCopyJoinUrl} className='flex group items-center gap-1 text-tersiory cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi p-1 rounded-md bi-copy duration-300 group-hover:bg-secondery" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                </svg>
                <h1 className=" text-lg font-semibold">  copy invite link</h1>
              </div>
              <svg onClick={() => { setShowQRCode((p) => !p) }} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className={`bi bi-qr-code duration-300 text-tersiory cursor-pointer rounded-md p-1  ${showQRCode ? "bg-secondery" : "bg-transparent"} hover:bg-secondery`} viewBox="0 0 16 16">
                <path d="M2 2h2v2H2z" />
                <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z" />
                <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z" />
                <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z" />
                <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z" />
              </svg>
            </div>
          </div>
          {showQRCode && <QRCode
            qrStyle='dots'
            eyeRadius={[
              // Rounds the eye modules (finder patterns)
              [15, 15, 15, 15], // Top-left
              [15, 15, 15, 15], // Top-right
              [15, 15, 15, 15], // Bottom-left
            ]}
            bgColor='#120f18'
            fgColor='#1192B8'
            size={200}
            value={window.document.location.origin + "/join?name=" + classData.name + "&key=" + classData.key} />}
          <h1 className='text-2xl bg-secondery rounded-md py-3 w-full text-center font-bold'>{classData.key}</h1>
        </div>
      }
      <div onScroll={handleAnnsScroll} className='w-[48rem] flex flex-col gap-2'>
        {/*<NoticeBoard notices={[{ notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" },
        { notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" }
        ]} />*/}
        <form onSubmit={handleAnnounce} className='bg-secondery flex gap-1 justify-center items-center w-full rounded-md border border-tersiory/50  p-1'>
          <input name="announce" value={typedAnnounce} onChange={(e) => { setTypedAnnounce(e.target.value) }} placeholder='Type to announce something ..' className='w-full bg-transparent/50 border rounded-md p-1 focus:outline-none border-tersiory/50' />
          <button type='submit' className=''>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-send rounded-md  cursor-pointer ${typedAnnounce ? "text-tersiory/70 hover:text-tersiory" : "text-dark "} duration-300 `} viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </form>
        <div className='flex justify-between'>
          <h1 className='font-semibold'>Recent Announcements  </h1>
          <svg onClick={() => { refetchAnns() }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="text-tersiory cursor-pointer hover:rotate-[720deg] duration-[1s] bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
          </svg>
        </div>
        {
          anns.map((ann) => (
            <div className=' flex flex-col gap-1 w-full rounded-md  border border-tersiory/50  p-4'>
              <h1 className='font-semibold flex justify-between' >{ann.username}<span className='ml-2 opacity-90 text-sm font-thin'>{new Date(ann.time).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
              </span> </h1>
              <p className='w-full break-words overflow-wrap'>{ann.announce}</p>
            </div>
          ))
        }
      </div>
    </main >
  )
}

export default ClassHome 
