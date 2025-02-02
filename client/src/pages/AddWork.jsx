import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Header from '../components/main/Header'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { SERVER_URL } from '../config/SERVER_URL';
import { toast } from 'sonner';
import { sub } from 'date-fns';

function AddWork() {
  const { type, id } = useParams()
  const [dueDate, setDueDate] = useState(new Date())
  const navigate = useNavigate()


  const [quiz, setQuiz] = useState([])
  const [students, setStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState(['*'])
  const [showSelectStudentPopup, setShowSelectStudentPopup] = useState(false)


  useEffect(() => {
    axios.get(SERVER_URL + "/class/peoples/" + id, { withCredentials: true })
      .then(({ data }) => { setStudents(data.peoples.students) })
  }, [id])

  const handleStudentChange = (e) => {
    if (e.target.value === '*') {
      if (e.target.checked) {
        document.querySelectorAll("#selectStudentsDIv input[type='checkbox']").forEach(cb => cb.checked = true);
        setSelectedStudents(['*'])
      } else {
        document.querySelectorAll("#selectStudentsDIv input[type='checkbox']").forEach(cb => cb.checked = false);
        setSelectedStudents([])
      }
    } else {
      if (e.target.checked) {
        setSelectedStudents((p) => [...p, e.target.value])
      } else {
        if (selectedStudents.includes('*')) {
          document.getElementById(e.target.id).checked = true
        } else {
          setSelectedStudents((p) => p.filter(id => id !== e.target.value))
        }
      }
    }
    console.log(selectedStudents)
  }
  useEffect(() => console.log(selectedStudents), [selectedStudents])

  const handleAssign = (e) => {
    e.preventDefault()

    switch (type.toLowerCase()) {
      case "assignment":
        {
          if (selectedStudents.length == 0) return toast.error("Select atleast one student")
          let dueDateUnix = new Date(dueDate)
          dueDateUnix.setUTCHours(23, 59, 59, 999)
          dueDateUnix = dueDateUnix.getTime()
          axios.post(SERVER_URL + "/work/add/assignment",
            {
              class_id: id,
              title: e.target.title.value,
              instruction: e.target.instructions.value,
              students: selectedStudents,
              due_date: dueDateUnix,
              can_edit: e.target.can_edit.checked
            },
            { withCredentials: true }
          ).then(({ data }) => {
            if (data.success) {
              toast.success("Task assigned")
            }
          })
          break
        }
      case "quiz": {

        break
      }
      default:
        {
          console.log("Invalid")
        }
    }
  }

  if (!(type.toLowerCase() === "assignment" || type.toLowerCase() === "quiz")) {
    return (
      <div className=''>Page Not Found</div>
    )
  }

  return (
    <div className='w-full text-light  h-full bg-dark pt-header min-h-screen'>
      <Header handleClose={() => { navigate("/class/" + id + "?tab=works") }} forWhat="popup" sub="Add Assignment" />
      <form onSubmit={handleAssign} className='h-full p-3 flex gap-3'>
        <div className='flex flex-col gap-3'>
          <div className='min-w-[56rem] w-[56rem] bg-secondery flex flex-col gap-3 p-3 rounded-md border border-tersiory/50'>
            <div>
              <h1 className='ml-2 font-bold'>Title  <span className='text-red-600'>*</span> </h1>
              <input required name='title' placeholder='Title' className='w-full font-semibold bg-transparent/50 border rounded-md p-2 focus:outline-none border-tersiory/50' />

            </div>
            <div className=''>
              <h1 className='ml-2 font-bold'>Instructions <span className='opacity-70'>   |  *<i className='font-normal'>italic</i>* _<b>strong</b>_ </span></h1>
              <textarea name='instructions' placeholder='Instructions (optional)' className='w-full h-[9rem] bg-transparent/50 border rounded-md p-2 focus:outline-none border-tersiory/50' ></textarea>
            </div>
          </div>
          {type.toLowerCase() === "quiz" &&
            <div className='min-w-[56rem] w-[56rem] bg-secondery flex flex-col gap-3 p-3 rounded-md border border-tersiory/50'>
              <div className='flex px-2 justify-between'>
                <h1 className='font-semibold'>Add Items</h1>
                <div className='flex justify-end'>


                </div>
              </div>
              <div>
                <h1 className='ml-2 font-bold'>Title  <span className='text-red-600'>*</span> </h1>
                <input required name='title' placeholder='Title' className='w-full font-semibold bg-transparent/50 border rounded-md p-2 focus:outline-none border-tersiory/50' />

              </div>
              <div>
                <h1 className='ml-2 font-bold'>Instructions <span className='opacity-70'>   |  *<i className='font-normal'>italic</i>* _<b>strong</b>_ </span></h1>
                <textarea name='instructions' placeholder='Instructions (optional)' className='w-full h-[9rem] bg-transparent/50 border rounded-md p-2 focus:outline-none border-tersiory/50' ></textarea>
              </div>
            </div>
          }
        </div>

        <div className='bg-secondery w-full h-fit max-h-full flex flex-col items-start gap-3 p-3 rounded-md border border-tersiory/50'>
          <div className='w-full flex flex-col gap-1'>
            <h1 className='text-md'>Assign to</h1>
            <div onClick={() => setShowSelectStudentPopup(true)} className='cursor-pointer bg-transparent/50 border text-center border-tersiory/50 p-3 rounded-md'>{selectedStudents[0] === '*' ? "All Students ^" : "selected students"}</div>
            {showSelectStudentPopup &&
              <div className='w-screen top-0 left-0 absolute z-10 bg-dark/30 min-h-screen h-full flex justify-center items-center'>
                <div className='w-[20rem] flex items-center justify-center rounded-2xl bg-secondery flex flex-col gap-3 p-4 text-xl'>
                  <h1 className='text-xl font-semibold '>Select Students</h1>
                  <div className='border w-full border-tersiory'></div>
                  <div id="selectStudentsDIv" className='flex flex-col gap-1'>
                    <div className='flex gap-2'>
                      <input onChange={handleStudentChange} defaultChecked={selectedStudents.includes('*')} value={'*'} id="all_students" type='checkbox' />
                      <label for="all_students" >All Students</label>
                    </div>
                    {students.map((student) => <div className='flex gap-2 '>
                      <input defaultChecked={selectedStudents.includes(student._id) || selectedStudents.includes('*')} onChange={handleStudentChange} value={student._id} id={student._id} type='checkbox' />
                      <label for={student._id}>{student.username}</label>
                    </div>)}
                  </div>
                  <button onClick={() => selectedStudents.length === 0 ? toast.error("Select atleast one student") : setShowSelectStudentPopup(false)} className='p-3 text-md rounded-md py-1 bg-tersiory'>Select</button>
                </div>
              </div>}
          </div>
          <div className='w-full flex flex-col gap-1 '>
            <h1 className='text-md'>Due date</h1>
            <DatePicker className='bg-transparent/50 rounded-md border border-tersiory/50 p-3 text-lg text-center w-full focus:outline-none' selected={dueDate} onChange={(date) => setDueDate(date)} />
          </div>
          <div className='w-full flex flex-col gap-1 '>
            <div className='flex w-full gap-3'>
              <input id="can_edit" name="can_edit" type="checkbox" className='bg-transparent/50 rounded-md border border-tersiory/50 text-lg text-center  focus:outline-none' />
              <label for="can_edit">can edit after submission befor hitting duedate</label>
            </div>
          </div>

          <input type="submit" value="Assign" className='cursor-pointer border duration-300 hover:bg-tersiory bg-tersiory p-3 w-full text-center text-lg border-tersiory/50 bg-tersiory/80 text-dark rounded-md' />
        </div>
      </form>
    </div>
  )
}
export default AddWork
