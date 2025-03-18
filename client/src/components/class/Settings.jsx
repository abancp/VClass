import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'
import ManageInfoPopup from '../popup/ManageInfoPopup'

function Settings({ id, role }) {
  const navigate = useNavigate()
  const [showManageInfoPapup, setShowManageInfoPapup] = useState(false)

  const deleteClass = () => {
    if (window.confirm("are you sure to delete this class")) {
      axios.delete(SERVER_URL + "/class/delete/" + id, { withCredentials: true })
        .then(({ data }) => {
          if (data.success) {
            toast.success("Class Deleted!")
            navigate("/")
          } else {
            toast.error(data.message)
          }
        })
        .catch(({ response }) => {
          toast.error(response.message || "something went wrong!")
        })
    }
  }

  return (
    <div className='w-full h-full pl-[4rem] p-[2rem]'>
      {showManageInfoPapup &&
        <ManageInfoPopup handleClose={() => setShowManageInfoPapup(false)} id={id} />
      }
      <div className='rounded-2xl bg-secondery/5 p-2 flex border border-secondery/20 flex-col gap-3 mt-[2rem]'>
        <h1 className='text-2xl text-tersiory font-bold '>Announcements</h1>
        <p>Manage announcements section in your class</p>
        <div className='w-full h-0 border-t border-tersiory/30'></div>
        <div className='flex justify-between w-full'>
          <h4>Who can post announcements : </h4>
          <select className='text-light bg-dark w-[16rem] cursor-pointer focus:outline-none rounded-md border border-tersiory/80'>
            <option className='bg-dark text-light'>Everyone</option>
            <option className='bg-dark text-light'>Teachers</option>
          </select>
        </div>
      </div>
      <div className='rounded-2xl bg-secondery/5 p-2 flex border border-secondery/20 flex-col gap-3 mt-[2rem]'>
        <h1 className='text-2xl text-tersiory font-bold '>Doubts</h1>
        <p>Manage doubts section in your class</p>
        <div className='w-full h-0 border-t border-tersiory/30'></div>
        <div className='flex justify-between w-full'>
          <h4>Select which Questions need answer ai : </h4>
          <select className='text-light bg-dark w-[16rem]  cursor-pointer focus:outline-none rounded-md border border-tersiory/80'>
            <option className='bg-dark text-light'>All Questions</option>
            <option className='bg-dark text-light'>AI selcted Common Questions</option>
            <option className='bg-dark text-light'>None</option>
          </select>
        </div>
        <div className='flex justify-between w-full'>
          <h4>Who can answer doubts : </h4>
          <select className='text-light bg-dark w-[16rem] cursor-pointer focus:outline-none rounded-md border border-tersiory/80'>
            <option className='bg-dark text-light'>Everyone</option>
            <option className='bg-dark text-light'>Teachers</option>
          </select>
        </div>
      </div>
      <div className='rounded-2xl bg-secondery/5 p-2 flex border border-secondery/20 flex-col gap-3 mt-[2rem]'>
        <h1 className='text-2xl text-tersiory font-bold '>Info</h1>
        <p>info helps to understand what is the purpose of your class</p>
        <div className='w-full h-0 border-t border-tersiory/30'></div>
        <div className='flex justify-between w-full'>
          <h4>Manage this class's info : </h4>
          <button onClick={() => setShowManageInfoPapup((p) => (!p))} className='px-2 py-1 font-semibold rounded-md bg-tersiory'>Manage Info</button>
        </div>
      </div>
      <div className='rounded-2xl bg-red-500/5 p-2 flex border border-red-500/20 flex-col gap-3 mt-[2rem]'>
        <h1 className='text-2xl text-red-500 font-bold '>Danger Zone</h1>
        <div className='w-full h-0 border-t border-red-500/30'></div>
        <div className='flex justify-between w-full'>
          <h4>Delete this Class permenently : </h4>
          <button onClick={deleteClass} className='px-2 font-semibold py-1 rounded-md bg-red-600'>Delete Class</button>
        </div>
      </div>
    </div>
  )
}

export default Settings
