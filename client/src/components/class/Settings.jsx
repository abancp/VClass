import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'

function Settings({ id, role }) {

  const navigate = useNavigate()

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
      <div className='rounded-2xl bg-red-500/5 p-2 flex flex-col gap-3 mt-[2rem]'>
        <h1 className='text-2xl text-red-500 font-bold '>Danger Zone</h1>
        <div className='w-full h-0 border-t border-tersiory'></div>
        <div className='flex justify-between w-full'>
          <h4>Delete this Class permenently : </h4>
          <button onClick={deleteClass} className='px-2 py-1 rounded-md bg-red-600'>Delete Class</button>
        </div>
      </div>
    </div>
  )
}

export default Settings
