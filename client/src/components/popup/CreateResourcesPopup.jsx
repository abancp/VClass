import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SERVER_URL } from '../../config/SERVER_URL'
import axios from 'axios'
import { toast } from 'sonner'
import CheckAnimation from '../sub/CheckAnimation'
import { useDropzone } from "react-dropzone"
import Loading from '../sub/Loading'

function CreateResourcesPopup({ handleClose, id, handleRefresh }) {
  const [file, setFile] = useState(false)
  const [url, setUrl] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [disableInput, setDisableInput] = useState(0)

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return
    setFile(acceptedFiles[0])
  }

  const handleTimeClose = (() => {
    setTimeout(() => {
      handleRefresh()
      handleClose()
    }, 1000)
  })

  const { getInputProps, getRootProps } = useDropzone({ onDrop })

  const getYTID = (url) => {
    try {
      const parsedUrl = new URL(url);

      // Case 1: Standard YouTube URLs (https://www.youtube.com/watch?v={id})
      if (parsedUrl.hostname.includes("youtube.com") && parsedUrl.searchParams.has("v")) {
        return parsedUrl.searchParams.get("v");
      }

      // Case 2: Shortened YouTube URLs (https://youtu.be/{id})
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.substring(1);
      }

      // Case 3: Embedded YouTube URLs (https://www.youtube.com/embed/{id})
      const embedMatch = parsedUrl.pathname.match(/^\/embed\/([^/?]+)/);
      if (embedMatch) return embedMatch[1];

      // Case 4: Old Flash Player format (https://www.youtube.com/v/{id})
      const vMatch = parsedUrl.pathname.match(/^\/v\/([^/?]+)/);
      if (vMatch) return vMatch[1];

      // Case 5: Shorts (https://www.youtube.com/shorts/{id})
      const shortsMatch = parsedUrl.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shortsMatch) return shortsMatch[1];
      //for lives
      if (parsedUrl.hostname === "www.youtube.com" && parsedUrl.pathname.startsWith("/live/")) {
        return parsedUrl.pathname.split("/")[2];
      }

    } catch (error) {
      console.error("Invalid YouTube URL:", error.message);
    }

    return null; // Return null if no ID is found
  }


  const isYTId = (s) => {
    if (typeof s !== "string" || !s.trim()) {
      return false
    }
    try {
      const url = new window.URL(s)
      if (!/(youtube\.com|youtu\.be)/.test(url.hostname)) {
        return false
      }
      if (url.hostname === "youtu.be" && url.pathname.length > 1) {
        return true
      }
      if (url.pathname === "/watch" && url.searchParams.has("v")) {
        return true
      }
      if (url.pathname.startsWith("/live")) {
        return true
      }
      if (/^\/embed\/[^/]+$/.test(url.pathname)) {
        return true
      }
      if (/^\/v\/[^/]+$/.test(url.pathname)) {
        return true
      }
    } catch (error) {
      return false
    }
  }

  const handleSubmit = ((e) => {
    e.preventDefault()
    setUploading(true)
    let data = { title: e.target.title.value }
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", e.target.title.value)
      axios.post(SERVER_URL + "/src/" + id, formData, { withCredentials: true }).then(({ data }) => {
        if (data.success) {
          setSuccess(true)
          handleTimeClose()
        }
        setUploading(true)
      })
    } else {
      if (isYTId(e.target.url.value)) {
        data.type = "url/yt"
        data.url = getYTID(e.target.url.value)
      } else {
        data.type = "url"
        data.url = e.target.url.value
      }
      axios.post(SERVER_URL + "/src/" + id, data, { withCredentials: true }).then(({ data }) => {
        if (data.success) {
          setSuccess(true)
          handleTimeClose()
        }
        setUploading(true)
      })

    }

  })

  return (
    < div

      onClick={handleClose} className='w-screen h-screen z-[10] fixed top-0 left-0 flex flex-col items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()} className='flex flex-col gap-3 shadow-lg items-center justify-start p-3 w-[30rem] h-[18rem] rounded-2xl  bg-secondery'>
        {success ?
          <CheckAnimation />
          :uploading?<Loading/>:
          <>
            <h1 className='font-bold text-2xl'>Add Resources</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 items-center justify-center p-3 w-[30rem] h-[20rem] rounded-2xl  bg-secondery'>
              <input
                required
                name="title"
                placeholder='Title *'
                className='placeholder:text-light/80 border-b border-secondery focus:outline-none border-tersiory/30 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[80%] p-1'
                type="text" />

              {url ? null :
                <div className='flex rounded-md h-[2.5rem] w-[80%] items-center justify-between border border-tersiory/30'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-arrow-up mx-2 text-tersiory" viewBox="0 0 16 16">
                    <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                  </svg>
                  <div className='w-full p-1 pl-0 h-full'>
                    <div className='text-tersiory text-center cursor-pointer border-2 border-tersiory border-dotted w-full h-full rounded-md' {...getRootProps()}>
                      <input className='w-full h-full'  {...getInputProps()} />
                      <p className=' text-lg '>{file ? file.name : "Select Or Drop here"}</p>
                    </div>
                  </div>
                </div>}
              {file ?null:
                <div className='flex  rounded-md h-[2.5rem] w-[80%] items-center justify-between border border-tersiory/30'>

                  {
                    isYTId(url) ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-youtube text-red-600 mx-2" viewBox="0 0 16 16">
                        <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-link-45deg mx-2 text-tersiory" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                      </svg>
                  }
                  <input name="url" onChange={(e) => setUrl(e.target.value)} className='w-full rounded-l-none rounded-r-md focus:ring-[3px] focus:outline-none focus:ring-tersiory/70 h-full bg-secondery' />
                </div>
              }


              <div className='flex  rounded-md h-[2.5rem] w-[80%] items-center justify-between border border-tersiory/30'>

                <input type="submit" className='text-lg font-semibold w-full bg-tersiory rounded-md focus:ring-[3px] cursor-pointer focus:outline-none focus:ring-tersiory/70 h-full bg-secondery' />
              </div>
            </form>
          </>
        }
      </motion.div>
    </div>
  )
}

export default CreateResourcesPopup
