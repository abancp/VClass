import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useParams } from 'react-router'
import Header from '../components/main/Header'
import { SERVER_URL } from '../config/SERVER_URL'

function Work() {

  const [work, setWork] = useState({})
  const { class_id, work_type, work_id } = useParams()

  useEffect(() => {
  }, [])

  return (
    <div className='w-full text-light h-full flex flex-col gap-3 pb-[1rem] bg-dark px-5 pt-[4rem] min-h-screen'>
      <Header />
      <h1 className='text-2xl w-full text-center font-semibold'>Assignment 1</h1>
      <div className='border-t border-tersiory w-full'></div>
      <div className='px-5 overflow-y-scroll h-[calc(100vh-12rem)]'>
        <Markdown>must submit as pdf</Markdown>
      </div>
      <div className='flex w-full justify-center'>
        <div className='rounded-2xl flex text-lg  flex-around  gap-1 p-1 h-[2rem] bg-secondery/50'>
          <div className='gap-2 px-2 flex items-center duration-300 hover:bg-dark/60 cursor-pointer rounded-2xl '>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-paperclip text-tersiory" viewBox="0 0 16 16">
              <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
            </svg>
            add file</div>
          <div className='gap-2 px-2 bg-secondery/60 flex items-center duration-300  hover:bg-secondery cursor-pointer rounded-2xl'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-circle-fill text-green-800" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            mark as done</div>
        </div>
      </div>
    </div>
  )
}

export default Work
