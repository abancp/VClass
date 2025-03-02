import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'

function ManageInfoPopup({ handleClose, id, visiter }) {
  const [info, setInfo] = useState("")
  const [tab, setTab] = useState(visiter ? "edit" : "preview")


  useEffect(() => {
    axios.get(SERVER_URL + "/class/info/" + id, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setInfo(data.info)
        } else {
          toast.error(data.message || "something went wrong!")
        }
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message || "something went wrong!")
      })
  }, [id])

  const handleUpdate = () => {
    if (visiter) return
    axios.post(SERVER_URL + "/class/info/" + id, { info }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success("Info Updated")
        } else {
          toast.error(data.message || "something went wrong!")
        }
      })
      .catch(({ response }) => {
        toast.error(response?.data?.message || "something went wrong!")
      })
  }

  const handleJoin = () => {
    axios.post(SERVER_URL + "/class/public/join", { _id: id }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success("Joined to class")
          handleClose()
        } else {
          toast.success(data.message)
        }
      })
  }

  return (
    <div onClick={() => { visiter || handleClose() }} className='bg-dark/80 w-screen backdrop-blur-sm  h-screen fixed top-0 left-0 z-[10000] flex justify-center items-center'>
      <div onClick={(e) => e.stopPropagation()} className='bg-secondery gap-4 flex flex-col items-center justify-center rounded-md w-[70rem] h-[34rem] p-4'>
        <h1 className='font-semibold text-2xl'>Class Info</h1>
        {
          visiter ||
          <div className='w-full gap-2 flex'>
            <div onClick={() => setTab("edit")} className={`px-2 cursor-pointer py-1 hover:bg-tersiory/50 duration-300 rounded-md ${tab === "edit" && "bg-tersiory"} `} >Edit</div>
            <div onClick={() => setTab("preview")} className={`px-2 py-1  cursor-pointer hover:bg-tersiory/50 duration-300 rounded-md ${tab === "preview" && "bg-tersiory"} `} >Preview</div>
          </div>
        }
        {
          tab === "edit" ?
            <textarea value={info} onChange={(e) => setInfo(e.target.value)} className='focus:outline-none w-full  bg-tersiory/5 p-2 h-full focus:border focus:border-tersiory/50  rounded-md'>

            </textarea> :
            <ReactMarkdown className={"h-full w-full text-left p-2"} remarkPlugins={[remarkGfm]}>{info}</ReactMarkdown>
        }

        {
          visiter ?
            <button onClick={handleJoin} className='px-5 py-1 bg-tersiory rounded-md font-semibold'>join class</button>
            :
            <button onClick={handleUpdate} className='px-5 py-1 bg-tersiory rounded-md font-semibold'>update</button>
        }

      </div>

    </div >
  )
}

export default ManageInfoPopup
