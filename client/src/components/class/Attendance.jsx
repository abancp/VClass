import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { SERVER_URL } from '../../config/SERVER_URL'
import { toast } from 'sonner'

function Attendance({ id, peoples, setPeoples, role }) {
  const [currentI, setCurrentI] = useState(0)
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    if (peoples?.teachers?.length === 0) {
      axios.get(SERVER_URL + "/class/peoples/" + id, { withCredentials: true })
        .then(({ data }) => {
          console.log(data)
          setPeoples(data.peoples)
        })
    }
  }, [peoples?.teachers?.length, id])

  const handleAttendance = (att) => {
    setAttendance((pa) => ({ ...pa, [peoples?.students[currentI].username]: att }))
    if (currentI + 1 < peoples.students.length) {
      setCurrentI((p) => p + 1)
    }
  }

  const handleUpdate = () => {
    axios.post(SERVER_URL + "/class/att/" + id, { att: attendance }, { withCredentials: true })
  }

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(SERVER_URL + "/class/" + id + "/att/export-excel", { withCredentials: true, responseType: "blob" })
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = "data.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success("Downloading...")
    } catch (error) {
      toast.error("something went wrong! : " + error)
    }
  }

  return (
    <div className='w-full justify-center flex-col gap-4 flex items-center h-full p-4'>
      {
        role === "teacher" && <div className='flex w-full justify-end'>
          <button onClick={handleExportExcel} className='p-1 px-2 hover:bg-tersiory text-light font-semibold duration-300 bg-tersiory/90 rounded-md' >Export to Excel</button>
        </div>}
      <div className='flex gap-3 w-full justify-center '>
        <div onClick={() => handleAttendance(false)} className=' rounded-2xl bg-red-500/50'>
          <svg xmlns="http://www.w3.org/2000/svg" width="106" height="106" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />

          </svg>
        </div>
        <div onClick={() => handleAttendance(true)} className='  rounded-2xl bg-green-300/40 '>
          <svg xmlns="http://www.w3.org/2000/svg" width="106" height="106" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
          </svg>

        </div>

      </div>
      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        {
          peoples?.students?.map((st, i) => (
            <div onClick={() => setCurrentI(i)} className={`min-w-[20rem] px-2 py-1 text-left text-lg bg-secondery/70 rounded-md ${i === currentI && "bg-tersiory/70 font-semibold"}`}>{st.username}</div>
          ))
        }
      </div>
      <button onClick={() => handleUpdate()} className='w-[20] px-2 py-1  text-left bg-secondery/70 hover:bg-tersiory/80 duration-300 rounded-md'>Submit</button>
    </div >
  )
}

export default Attendance
