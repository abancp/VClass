import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import StudentPopup from '../popup/StudentPopup'

function Peoples({ id, role }) {
  const [peoples, setPeoples] = useState({ students: [], teachers: [] })
  const [selIndex, setSelIndex] = useState(-1)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [selectedStudentName, setSelectedStudentName] = useState(null)
  const [showStudent, setShowStudent] = useState(false)

  useEffect(() => {
    if (peoples?.teachers?.length === 0) {
      axios.get(SERVER_URL + "/class/peoples/" + id, { withCredentials: true })
        .then(({ data }) => {
          console.log(data)
          setPeoples(data.peoples)
        })
    }
  }, [peoples?.teachers?.length, id])


  const removeStudent = (user_id) => {
    axios.post(SERVER_URL + "/class/remove-student", { class_id: id, user_id }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success("User removed!")
          setPeoples((prev) => ({
            ...prev, 
            students: prev.students.filter((v) => String(v._id) !== String(user_id))
          }));
        } else {
          toast.error("something went wrong!")
        }
      })
      .catch(() => {
        toast.error("something went wrong!")
      })
  }

  const handleUserClick = (user_id) => {
    if (role !== "teacher") return
    console.log(user_id)
    setSelectedStudentId(user_id)
    axios.get(SERVER_URL + "/class/student/" + id + "/" + user_id, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log(data.user)
          setShowStudent(true)
          setSelectedStudent(data.user)
        } else {
          toast.error(data.message)
        }
      })
      .catch(({ response }) => {
        toast.error(response.data?.message || "something went wrong!")
      })
  }

  return (
    <main className='p-4 flex flex-col gap-2 mb-2 justify-center items-start' >
      {showStudent && <StudentPopup user={selectedStudent} username={selectedStudentName} handleClose={() => { setShowStudent(false) }} />}
      <h1 className='text-x py-2 rounded-md border border-tersiory px-4 font-bold'>Teachers</h1>
      {
        peoples?.teachers?.map((teacher) => (
          <div className='py-2 w-[20rem] ml-4 px-4 text-lg rounded-md bg-secondery'>{teacher.username}</div>
        ))
      }
      <h1 className='text-x  py-2 rounded-md border border-tersiory px-4 font-bold'>Students</h1>
      {
        peoples?.students?.map((student, i) => (
          <div className='flex flex-col gap-2 ml-4 bg-secondery rounded-md'>
            <div className='py-2 w-[20rem] pl-4 px-4 text-lg flex justify-between items-center rounded-md bg-secondery'>
              <h3 onClick={() => { handleUserClick(student._id); setSelectedStudentName(student.username) }} className="duration-300 hover:text-tersiory cursor-pointer">{student.username}</h3>
              {role === "teacher" &&
                <svg onClick={() => { setSelIndex((p) => p !== i ? i : -1) }} xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" className="bi bi-three-dots-vertical cursor-pointer rounded-md duration-300 hover:bg-tersiory/30 p-2" viewBox="0 0 16 16">
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>}
            </div>
            {selIndex === i &&
              <div className='w-full flex justify-center items-center p-2 h-full flex-col'>
                <button className='bg-secondery/20 w-full rounded-md' onClick={() => removeStudent(student._id)}>remove</button>
              </div>
            }

          </div>
        ))
      }


    </main >

  )
}

export default Peoples
