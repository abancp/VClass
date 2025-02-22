import React, { useState } from 'react'
import Header from "../components/main/Header"
import { SERVER_URL } from '../config/SERVER_URL'
import axios from 'axios'
import { useNavigate } from 'react-router'
import SelectBGPopup from '../components/popup/SelectBGPopup'

function CreateClass() {
  const navigate = useNavigate()
  const [descLen, setDescLen] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [bgUrl, setBgUrl] = useState("back.png")

  const handleCreate = (e) => {
    e.preventDefault()

    axios.post(SERVER_URL + "/class/",
      {
        name: e.target.name.value,
        subject: e.target.subject.value,
        description: e.target.description.value,
        bg_url:bgUrl
      },
      {
        withCredentials: true
      }
    ).then(({ data }) => {
      if (data.success) {
        navigate('/class/' + data.classid)
      }
    })
  }

  const handleJoin = (e) => {
    e.preventDefault()
    axios.post(SERVER_URL + "/class/join",
      {
        name: e.target.join_name.value,
        key: e.target.id.value
      },
      { withCredentials: true }
    ).then(({ data }) => {
      if (data.success) {
        navigate('/class/' + data.classid)
      }
    })
  }

  return (
    <div className="min-h-screen pt-header justify-center text-light bg-dark flex items-center py-10 w-100 ">
      <Header />
      {showPopup && <SelectBGPopup setSelected={setBgUrl} handleClose={() => setShowPopup(false)} />}
      <div className="border border-black bg-secondery w-[50rem] py-8 min-h-[23rem] justify-between items-center flex rounded-md">
        <div className="w-1/2 gap-3 h-full flex flex-col justify-center items-center">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-3xl font-bold ">Create Class</h1>
            <p>Create a virtual classroom</p>
            <form onSubmit={handleCreate} method="post" className="text-dark w-full h-full flex flex-col justify-center gap-3 items-center">
              <input name="name" placeholder="name" type="text" className="w-[80%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
              <input name="subject" placeholder="subject" type="text" className="w-[80%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
              <textarea onChange={(e) => setDescLen(e.target.value?.length)} maxLength="100" name="description" placeholder="description" type="text" className="w-[80%] rounded-2xl max-h-[9rem] h-[2rem] px-3 font-semibold text-lg border border-black" ></textarea>
              <h1 className='text-sm font-[100] text-end text-light'>{descLen}/100</h1>
              <img onClick={()=>setShowPopup(true)} alt="cover-photo" src={"/"+bgUrl} className='border cursor-pointer border-tersiory/50 rounded-md w-[15rem] h-[7rem] object-cover' />
              <input  type="submit" value="Create Class" className=" text-light w-[80%] hover:text-white hover:bg-tersiory duration-300 rounded-full h-[2rem] px-3 font-semibold cursor-pointer text-lg border border-black" />
            </form>
          </div>
        </div>
        <div className="h-[90%] opacity-90 border-l border-black"></div>
        <div className="w-1/2 h-ull flex flex-col justify-center gap-3 items-center">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-3xl font-bold ">Join  Class</h1>
            <p>Join in a virtual classroom</p>
            <form method="post" onSubmit={handleJoin} className="text-dark w-full h-full flex flex-col justify-center gap-3 items-center">
              <input name="join_name" placeholder="name" type="text" className="w-[80%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
              <input name="id" placeholder="id" type="text" className="w-[80%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
              <input type="submit" value="Join Class" className=" text-light w-[80%] hover:text-white hover:bg-tersiory duration-300 rounded-full h-[2rem] px-3 font-semibold cursor-pointer text-lg border border-black" />
            </form>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CreateClass
