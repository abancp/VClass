import React, { useState } from 'react'
import { useParams } from 'react-router'
import Header from '../components/main/Header'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { SERVER_URL } from '../config/SERVER_URL';
import { toast } from 'sonner';

function AddWork() {
  const { type,id } = useParams()
  const [dueDate, setDueDate] = useState(new Date())
  const handleAssign = (e) => {
    e.preventDefault()
    switch (type.toLowerCase()) {
      case "assignment":
        {
          axios.post(SERVER_URL + "/work/add/assignment",
            {
              class_id:id,
              title: e.target.title.value,
              instruction: e.target.instructions.value,
              students:['*'],
              dueDate

            },
            { withCredentials: true }
          ).then(({ data }) => {
            if (data.success) {
              toast.success("Task assigned")
            }
          })
          break
        }
      default:
        {
          console.log("Invalid")
        }
    }
  }

  if (!(type.toLowerCase() === "assignment")) {
    return (
      <div className=''>Page Not Found</div>
    )
  }
  return (
    <div className='w-full text-light  h-full bg-dark pt-header min-h-screen'>
      <Header sub="Add Assignment" />
      <form onSubmit={handleAssign} className='h-full p-3 flex gap-3'>
        <div className='min-w-[56rem] w-[56rem] bg-secondery flex flex-col gap-3 p-3 rounded-md border border-tersiory/50'>

          <input name='title' placeholder='Title' className='w-full font-semibold bg-transparent/50 border rounded-md p-2 focus:outline-none border-tersiory/50' />
          <textarea name='instructions' placeholder='Instructions (optional)' className='w-full min-h-[12rem] h-full bg-transparent/50 border rounded-md p-2 focus:outline-none border-tersiory/50' ></textarea>

        </div>

        <div className='bg-secondery w-full h-fit max-h-full flex flex-col items-start gap-3 p-3 rounded-md border border-tersiory/50'>
          <div className='w-full flex flex-col gap-2 '>
            <h1 className='text-md'>Assign to</h1>
            <div className='border cursor-pointer p-3 w-full bg-transparent/50 text-center text-lg  border-tersiory/50 rounded-md'>
              All Students
            </div>
          </div>
          <div className='w-full flex flex-col gap-2 '>
            <h1 className='text-md'>Due date</h1>
            <DatePicker className='bg-transparent/50 rounded-md border border-tersiory/50 p-3 text-lg text-center w-full focus:outline-none' selected={dueDate} onChange={(date) => setDueDate(date)} />

          </div>
          <input type="submit" value="Assign" className='cursor-pointer border duration-300 hover:bg-tersiory bg-tersiory p-3 w-full text-center text-lg border-tersiory/50 bg-tersiory/80 text-dark rounded-md'/>
        </div>
      </form>
    </div>
  )
}
export default AddWork
