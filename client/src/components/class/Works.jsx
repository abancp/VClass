import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import CreateWorkPopup from '../popup/CreateWorkPopup'
import { Link } from 'react-router'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import Switch from "react-switch"

function Works({ id, role }) {
  const [works, setWorks] = useState([])
  const [worksSkip, setWorksSkip] = useState(0)
  const [workFetch, setWorkFetch] = useState(false)
  const [showWorkPopup, setShowWorkPopup] = useState(false)
  const [showWork, setShowWork] = useState(false)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const [fileLink, setFileLink] = useState()
  const [workid, setWorkid] = useState()
  const [selectedWork, setSelectedWork] = useState({})
  const [tab, setTab] = useState(role === "teacher" ? "submissions" : "instructions")
  const [acceptSubmits, setAcceptSubmits] = useState(true)
  const [acceptSubmitsSaving, setAcceptSubmitsSaving] = useState(false)
  const [submits, setSubmits] = useState([])
  const [quiz, setQuiz] = useState({})
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    if (workFetch && worksSkip === 0) {
      return
    }
    axios.get(SERVER_URL + "/work/works/" + id + "?skip=" + worksSkip, { withCredentials: true }).then(({ data }) => {
      if (data.success) {
        setWorkFetch(true)
        console.log("Fetched works", works)
        setWorks((p) => [...p, ...data.works])
      }
    })
  }, [worksSkip, workFetch, id])

  useEffect(() => {
    console.log(quiz)
  }, [quiz])

  useEffect(() => {
    if (!showWork || role === "student") return
    axios.get(SERVER_URL + "/work/submits/" + id + "/" + selectedWork._id.$oid, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setSubmits(data.submits)
          console.log(data.submits)
          setTotalStudents(data.total_students)
        }
      })
  }, [showWork, selectedWork, id, role])

  const handleWorksScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    console.log(offsetHeight, scrollTop, scrollHeight)
    if (offsetHeight + scrollTop === scrollHeight) {
      setWorksSkip(works.length)
    }
  }


  const handleSubmitWork = () => {
    if (!window.confirm("Are you sure to submit ?")) return
    let response = {}
    if (selectedWork.type === "assignment") {
      response = { url: fileLink }
    } else if (selectedWork.type === "quiz") {
      response = quiz
    }
    console.log(response)
    axios.post(SERVER_URL + "/work/submit/" + id + "/" + selectedWork._id.$oid, response, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success("Submitted . your teacher will check that!")
          setShowWork(false)
        } else {
          toast.error(data.message)
        }
      })
      .catch(({ response }) => { toast.error("something went wrong!") })
  }

  const handleChangeAcceptSubmits = (accept) => {
    if (acceptSubmitsSaving) return
    console.log("changed!", accept)
    setAcceptSubmits(accept)
    setAcceptSubmitsSaving(true)
    axios.post(SERVER_URL + "/work/" + id + "/" + selectedWork._id.$oid + "/accept-submits", { accept_submits: accept }, { withCredentials: true })
      .then(({ data }) => {
        if (!data.success) {
          toast.error(data.message)
        }
        setAcceptSubmitsSaving(false)
      })
      .catch(() => {
        toast.error("something went wrong!")
        setAcceptSubmitsSaving(false)
      })
  }

  return (
    <div className='w-full flex flex-col gap-2 justify-start p-3 min-h-[calc(100vh-3.5rem)] '>


      {(showWorkPopup && role === "teacher" && !showWork) && <CreateWorkPopup id={id} handleClose={() => { setShowWorkPopup(false) }} />}
      {!showWork &&
        <div onScroll={handleWorksScroll} className={`gap-3 flex flex-col overflow-y-scroll p-3 ${role === "teacher" ? "h-[calc(100vh-9.2rem)]" : "h-[calc(100vh-5rem)]"} w-full`}>
          {
            works.map((work) => (
              <div className='rounded-2xl w-full p-2 border-tersiory/50 bg-secondery/50'>
                <h1 onClick={() => { setShowWork(true); setSelectedWork(work); setAcceptSubmits(work.accept_submits) }} className='font-semibold text-lg cursor-pointer hover:text-tersiory w-fit'>{work.title}</h1>
                <div className='flex gap-3 mt-1  text-tersiory/90 '>
                  <h6 className='font-light text-[14px]'>{work.teacher_name}</h6>
                  <div className=' px-[4px]  text-light border border-tersiory/70 bg-tersiory/30 flex justify-center items-center text-xs rounded-full'>{work.type}</div>

                  <h6 className='font-light text-[14px]' > {new Date(work.due_date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'numeric',
                  })}</h6>
                </div>
              </div>
            ))
          }
        </div>}
      {(!showWork && role === "teacher") &&
        <div onClick={() => { setShowWorkPopup((p) => (!p)) }} className='cursor-pointer hover:text-tersiory duration-300 h-[4rem] gap-3 rounded-md w-full flex bg-secondery items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          <h1 className='text-2xl'>Create</h1>
        </div>
      }

      {showWork &&
        <>
          <div className='flex justify-between items-center'>
            <svg onClick={() => setShowWork(false)} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="hover:rotate-[180deg] duration-300 text-tersiory cursor-pointer bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
            <h1 className='text-2xl  text-center font-semibold'>{selectedWork.title}</h1>
            <div className='text-md font-thin'>
              <h6 className='font-light text-[14px]' >posted : {new Date(selectedWork.time).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              })}</h6>
              <h6 className='font-light text-[14px]' >due date: {new Date(selectedWork.due_date).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              })}</h6>
            </div>
          </div>
          <div className='border-b flex border-tersiory w-full'>
            {role === "teacher" && <div onClick={() => setTab("instructions")} className={`p-2 duration-300 hover:bg-secondery/40 cursor-pointer ${tab === "instructions" && "bg-secondery"}`}>Instructions</div>}
            {role === "teacher" && <div onClick={() => setTab("submissions")} className={`p-2 duration-300 hover:bg-secondery/40 cursor-pointer ${tab === "submissions" && "bg-secondery"}`}>Submissions</div>}
          </div>
          {tab === "instructions" && <div className={`px-5 flex flex-col gap-3 overflow-y-scroll ${role === "teacher" ? "h-[calc(100vh-11.9rem)]" : "h-[calc(100vh-13.9rem)]"}`}>
            {/*<ReactMarkdown>{selectedWork.instruction}</ReactMarkdown>*/}
            <h4>{selectedWork.instruction}</h4>
            {selectedWork.type === "quiz" && selectedWork.quiz?.map((question, qi) => (
              <div>
                <div className='min-w-[56rem] w-[56rem] bg-secondery/70 flex flex-col gap-3 p-3 rounded-2xl '>
                  <div className='flex flex-col px-2 justify-between'>
                    <div className='flex gap-2 justify-between'>
                      <h1 className='text-lg'>{(qi + 1) + "  " + question.question}</h1>
                      <h3>({question.mark})</h3>
                    </div>

                    {
                      question.type === "MCQ" && question.options?.map((option, oi) => (
                        <div className=' flex  gap-2'>
                          <input onChange={(e) => { setQuiz((p) => ({ ...p, [qi]: e.target.value })) }} name={qi} value={option} type="radio" id={qi + "-" + oi} />
                          <label className='cursor-pointer' for={qi + "-" + oi}>{option}</label>
                        </div>
                      ))
                    }

                    {
                      question.type === "SHORT" &&
                      <div className=' flex  gap-2'>
                        <input className='font-semibold border-secondery duration-300 outline-none focus:border-b-2 focus:outline-none focus:border-tersiory hover:border-tersiory/30 border-b bg-transparent w-full p-1'
                          onChange={(e) => { setQuiz((p) => ({ ...p, [qi]: e.target.value })) }} name={qi} />
                      </div>
                    }
                    {
                      question.type === "DESCRIPTIVE" &&
                      <div className=' flex  gap-2'>
                        <textarea
                          className='font-semibold border-secondery duration-300 outline-none focus:border-b-2 focus:outline-none focus:border-tersiory hover:border-tersiory/30 border-b bg-transparent w-full p-1'
                          onChange={(e) => { setQuiz((p) => ({ ...p, [qi]: e.target.value })) }} name={qi} ></textarea>
                      </div>
                    }
                  </div>

                </div>
              </div>
            ))
            }
            {
              (role === "student" && selectedWork.type === "quiz") &&
              <div className='w-full flex justify-center'>
                <button onClick={handleSubmitWork} className='w-fit rounded-md px-3 p-2 bg-tersiory text-lg'>Submit</button>
              </div>
            }
          </div>}

          {(tab === "submissions" && role === "teacher") &&
            <div className='flex h-full gap-3 w-full'>
              <div className='p-4 w-[30rem] flex flex-col gap-2'>
                <h1 className='text-2xl font-semibold text-tersiory'><span className='text-green-600'>{submits.length}</span>/{totalStudents} Submitted</h1>
                <div className='flex items-center  gap-2'>
                  <Switch checked={acceptSubmits} height={20} width={48} onChange={handleChangeAcceptSubmits} />
                  {acceptSubmitsSaving && <p>saving...</p>}
                  <h4>accepting submissions</h4>
                </div>
              </div>

              <div className='relative rounded-md p-2  w-[36rem] h-full'>
                <div className='w-full text-left rounded-md'>
                  <table className='rounded-md w-full' border={1}>
                    <thead className='rounded-md uppercase gap-3 bg-tersiory'>
                      <tr className='rounded-md' >
                        <th scope='col' className='py-3 px-6'>Student</th>
                        <th scope='col' className='py-3 px-6'>Work</th>
                        <th scope='col' className='py-3 px-6'>Mark</th>
                        <th scope='col' className='py-3 px-6'>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {submits.map((submit) => (
                        <tr className='odd:bg-secondery/40 border-b border-tersiory/70'>
                          <td className='py-3 px-6'>{submit.username}</td>
                          <td className='py-3 px-6  flex items-center'><a rel='noreferrer' className={` ${submit.response?.url && "text-blue-500 hover:underline"} `} target="_blank" href={submit.response?.url}>view</a></td>
                          <td className={`py3   px-6 ${submit.complete_val || " text-tersiory"}`}>{submit.complete_val ? submit.mark : "processing"}</td>
                          <td className='py-3 px-6'>{new Date(submit.time).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                          })}</td>
                        </tr>
                      ))
                      }
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          }
          {(role === "student" && selectedWork.type === "assignment") &&
            <div className='flex w-full justify-center'>
              <div className={`rounded-2xl flex flex-col text-lg duration-200 items-center justify-end gap-1 p-1 ${showFileUploader ? "h-[4.3rem]" : "h-[2.3rem]"} bg-secondery/50`}>
                {showFileUploader && <div className={` ${showFileUploader ? "h-[2rem]" : "h-0"} duration-300 flex justify-center`}>
                  <input value={fileLink} onChange={(e) => setFileLink(e.target.value)} placeholder='paste link here..' className='bg-dark  h-full focus:outline-none px-1 rounded-2xl' />
                </div>}
                <div className='flex'>
                  <div onClick={() => { setShowFileUploader((p) => !p) }} className='gap-2 px-2 flex items-center duration-300 hover:bg-dark/60 cursor-pointer rounded-2xl '>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-paperclip text-tersiory" viewBox="0 0 16 16">
                      <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
                    </svg>
                    add file</div>
                  <div onClick={handleSubmitWork} className='gap-2 px-2 bg-secondery/60 flex items-center duration-300  hover:bg-secondery cursor-pointer rounded-2xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle-fill text-green-800" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    mark as done</div>
                </div>
              </div>
            </div>}
        </>

      }
    </div >

  )
}

export default Works
