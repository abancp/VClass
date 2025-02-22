import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../config/SERVER_URL'
import { toast } from 'sonner'
import { QRCode } from 'react-qrcode-logo'
import NoticeBoard from '../main/NoticeBoard'
import { AnimatePresence, motion } from 'framer-motion'
import Scrollbars from 'react-custom-scrollbars-2'
import CreateResourcesPopup from '../popup/CreateResourcesPopup'
import ReactPlayer from 'react-player'
import CheckAnimation from '../sub/CheckAnimation'
import GetSVG from '../sub/GetSVG'

function ClassHome({ id, classData, role }) {
  const [showQRCode, setShowQRCode] = useState(false)
  const [typedAnnounce, setTypedAnnounce] = useState()
  const [anns, setAnns] = useState([])
  const [annSkip, setAnnSkip] = useState(0)
  const [showCreateSrcPopup, setShowCreateSrcPopup] = useState(false)
  const [srcs, setSrcs] = useState([])
  const [selectedSrcIndex, setSelectedSrcIndex] = useState(0)
  const [srcsRefresh, setSrcsRefresh] = useState(Date.now())
  const [downloadUrl, setDownloadUrl] = useState()

  useEffect(() => {
    axios.get(SERVER_URL + "/ann/anns/" + id + "?skip=" + annSkip, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        console.log("Fecthed anns")
        setAnns((p) => [...p, ...data.anns])
      }
    })
  }, [annSkip, id])

  useEffect(() => {
    if (!srcs[selectedSrcIndex]?.url) return
    setDownloadUrl("")
    axios.get(SERVER_URL + "/src/" + id + "/get-file-url/" + srcs[selectedSrcIndex]?.url, { withCredentials: true }).then(({ data }) => {
      console.log(data)
      if (data.success) {
        setDownloadUrl(data.download_url)
      }
    })
  }, [selectedSrcIndex, srcs, id])

  useEffect(() => {
    axios.get(SERVER_URL + "/src/srcs/" + id + "?limit=20", { withCredentials: true }).then(({ data }) => {
      console.log(data)
      if (data.success) {
        console.log("Fetched srcs")
        setSrcs(data.srcs)
        console.log(data)
      }
    })
  }, [id, srcsRefresh])

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
          setAnnSkip(0)
          setAnns(data.anns)
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
    < main className='p-4 flex gap-4 justify-center items-start' >
      <AnimatePresence>
        {showCreateSrcPopup && <CreateResourcesPopup handleRefresh={() => { setSrcsRefresh(Date.now()) }} id={id} handleClose={() => { setShowCreateSrcPopup(false) }} />}
      </AnimatePresence>
      <div className="flex flex-col gap-4">
        {role === "teacher" &&
          < motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut", bounce: 0.3 }}
            className={`w-[15rem] transition-all ${showQRCode ? "h-[24.5rem]" : "h-[9.9rem]"} p-3 light:bg-light-secondery/50 bg-secondery/50 rounded-2xl flex flex-col gap-3 duration-100 `}>
            <div className='flex gap-2 flex-col justify-center items-start justify-between'>
              <h1 className=" text-lg font-semibold">Class Key</h1>
              <div className='flex justify-between items-center w-full'>
                <div onClick={handleCopyJoinUrl} className='flex group items-center gap-1 text-tersiory cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi p-1 rounded-md bi-copy duration-300 group-hover:group-hover:bg-secondery" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                  </svg>
                  <h1 className=" text-lg font-semibold">  copy invite link</h1>
                </div>
                <svg onClick={() => { setShowQRCode((p) => !p) }} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className={`bi bi-qr-code duration-300 text-tersiory cursor-pointer rounded-md p-1  ${showQRCode ? "bg-secondery" : "bg-transparent"} :bg-light-secondery hover:bg-secondery`} viewBox="0 0 16 16">
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
          </motion.div>

        }
        {role === "teacher" &&
          < motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut", bounce: 0.3 }}
            className={`w-[15rem] border-2 border-dotted border border-tersiory/30 transition-all  p-3 bg-secondery/20 rounded-2xl items-center justify-center flex-col gap-3 duration-100 `}
            onClick={() => { setShowCreateSrcPopup(true) }}
          >
            <div className='cursor-pointer hover:bg-opacity-80 group flex gap-2 flex-col justify-center items-center justify-between'>
              <h1 className="text-left w-full  text-lg font-semibold">Upload Resuorces</h1>
              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" className="bi duration-300 group-hover:text-tersiory text-tersiory/50 bi-plus-square-dotted" viewBox="0 0 16 16">
                <path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
            </div>

          </motion.div>

        }
        {
          srcs.map((src, i) => (
            <div onClick={() => { setSelectedSrcIndex(i) }} className="w-[15rem] cursor-pointer transition-all h-full relative bg-secondery/50 rounded-2xl items-center  justify-center flex-col gap-3 duration-100"
            >
              <div className={`w-full h-full rounded-2xl hover:backdrop-blur-md hover:light:bg-light-secondery/30 hover:bg-secondery/30 duration-300 ${src?.type === "url/yt" ? " hover:text-light text-transparent " : "  hidden "} absolute flex text-xl  items-center justify text-sm text-center font-semibol`}>{src.title}</div>     {src.type === "url/yt" ?
                <img className='rounded-2xl' alt={src?.title} src={`https://img.youtube.com/vi/${src?.url}/maxresdefault.jpg
`} />
                :
                <div className='flex p-3 pr-1 justify-between items-center rounded-2xl bg-secondery/60'>
                  <div className='text-lg '>{src?.title}</div>
                  <div className='rounded-md h-fit p-1 w-fit text-tersiory '><GetSVG type={src?.type?.split("/")[1]} /></div>
                </div>
              }
            </div>
          ))
        }

      </div>
      <div className='w-[48rem] flex  p-2 pb-1 pt-0 rounded-2xl  flex-col gap-4'>
        {/*<NoticeBoard notices={[{ notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" },
        { notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" }
        ]} />*/}
        {
          (srcs?.length >= selectedSrcIndex + 1) &&
          <div
            className="w-full   bg-secondery/50 rounded-2xl"
          >
            <div className='h-[2rem] flex justify-start items-center text-lg font-semibold text-left p-2 '>{srcs[selectedSrcIndex]?.title}</div>
            {/*<img alt={srcs[0]?.title} src={`https://img.youtube.com/vi/${srcs[0]?.url}/maxresdefault.jpg
`} />*/}
            {srcs[selectedSrcIndex]?.type === "url/yt" ?
              <iframe
                className="w-full h-[26.45rem] rounded-b-2xl "
                src={"https://www.youtube.com/embed/" + srcs[selectedSrcIndex]?.url}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              :

              (srcs[selectedSrcIndex]?.type?.endsWith("jpeg") || srcs[selectedSrcIndex]?.type?.endsWith("png") === "") ?
                <img
                  className="w-full  rounded-b-2xl "
                  src={downloadUrl}
                  alt={srcs[selectedSrcIndex]?.title}
                />
                :
                srcs[selectedSrcIndex]?.type?.startsWith("url") ?
                  srcs[selectedSrcIndex]?.url?.endsWith(".pdf") ?
                    <iframe
                      className="w-full h-[26.45rem] rounded-b-2xl "
                      src={srcs[selectedSrcIndex]?.url}
                      title="Media Player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    :
                    <div className='bg-secondery text-center text-blue-600 underline rounded-2xl p-2'><a target="_blank" rel='noreferrer' href={srcs[selectedSrcIndex]?.url}>{srcs[selectedSrcIndex]?.url}</a></div>
                  :
                  <iframe
                    className="w-full h-[26.45rem] rounded-b-2xl "
                    src={downloadUrl}
                    title="Media Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
            }


          </div>
        }
        <div className='bg-secondery/50 p-2 rounded-2xl h-[25rem]'>
          <Scrollbars style={{ "zIndex": 0 }} onScroll={handleAnnsScroll}>
            <form onSubmit={handleAnnounce} className='bg-secondery flex gap-1 justify-center items-center w-full rounded-2xl  p-1'>
              <input name="announce" value={typedAnnounce} onChange={(e) => { setTypedAnnounce(e.target.value) }} placeholder='Type to announce something ..' className='w-full bg-transparent/50   rounded-2xl p-1 px-2 focus:outline-none ' />
              <button type='submit' className=''>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-send rounded-md  cursor-pointer ${typedAnnounce ? "text-tersiory/70 hover:text-tersiory" : "text-dark "} duration-300 `} viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
              </button>
            </form>
            <div className='flex justify-between my-1'>
              <h1 className='font-semibold'>Recent Announcements  </h1>
              <svg onClick={() => { refetchAnns() }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="text-tersiory cursor-pointer hover:rotate-[720deg] duration-[1s] bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
              </svg>
            </div>
            {anns.length === 0 && <div className='w-full h-full flex justify-center items-center'> <h1 className='font-semibold text-2xl opacity-60 text-center'>No Announcements</h1></div>}
            {
              anns.map((ann) => (
                <div className=' flex my-2 flex-col gap-1 w-full rounded-2xl bg-secondery/80  p-4'>
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
          </Scrollbars>
        </div>

      </div>
    </main >
  )
}

export default ClassHome 
