import React, { useState } from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"
import { motion } from 'framer-motion'
import Scrollbars from 'react-custom-scrollbars-2'

function AIChat({ id, chats, setChats }) {
  const [thinking, setThinking] = useState(false)
  const [prompt, setPrompt] = useState("")

  const handleGenerate = (e) => {
    e && e.preventDefault()
    if (thinking) return
    setThinking(true)
    setChats((prev) => [...prev, { user: prompt }])
    if (!prompt) return
    axios.post(SERVER_URL + "/ai/" + id + "/gen", { prompt: prompt }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setPrompt("")
          setThinking(false)
          setChats((prev) => [...prev, { ai: data.response }])
        } else {
          setChats((prev) => [...prev, { ai: "Oh , I have issue right now" }])

        }
      }).catch(() => {
        setThinking(false)
        setPrompt("")
        setChats((prev) => [...prev, { ai: "Oh , I have issue right now,please try again later" }])
      })
  }

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleGenerate(e)
    }
  }

  return (
    <div className='w-full flex flex-col gap-2 items-center justify-end  p-3 h-[calc(100vh-3.5rem)] '>

      <Scrollbars>
        <div className='gap-3 items-center flex flex-col  h-[calc(100vh-10rem)] w-[50rem] p-3 w-full'>
          {chats.length !== 0 ?
            chats.map((chat) => {
              let isUser = chat.user !== undefined;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut", bounce: 0.3 }}

                  className={`flex w-[50rem] ${isUser ? " justify-end" : "justify-start"}`}>
                  <div className={`rounded-2xl px-4 p-2 ${isUser && "max-w-[45rem] bg-secondery/30"}`}>
                    {/*<ReactMarkdown remarkPlugins={[remarkGfm]}>{isUser ? chat.user : chat.ai}</ReactMarkdown>*/}
                    <h4>{isUser ? chat.user : chat.ai}</h4>
                  </div>
                </motion.div>
              );
            })
            :
            <div className='w-full h-full justify-center items-center gap-3 flex flex-col'>
              <h1 className='text-4xl font-bold'>How Can i Help You ?</h1>
              <div className='cursor-pointer  duration-300 p-2 rounded-2xl w-[50rem] flex-col flex bg-secondery items-center justify-center'>
                <form className='w-full flex h-full' onSubmit={handleGenerate}>
                  <textarea placeholder='you can ask anything about this class , works and other complex prompts' onChange={(e) => setPrompt(e.target.value)} value={prompt} onKeyDown={handleEnter} name="input_area" className='w-full focus:outline-none bg-transparent min-h-[5rem] max-h-[10rem] '></textarea>
                  <div className='flex w-fit px-3 items-end justify-end'>
                    <button type='submit'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" className="bi bi-arrow-up-circle-fill text-light" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                      </svg>
                    </button>
                  </div>
                </form>

              </div>
              <div className='w-full flex justify-center gap-3'>
                <div onClick={() => { setPrompt("How Many Assignments in this class") }} className='p-2 px-3 cursor-pointer rounded-2xl border border-tersiory/80'>How Many </div>
                <div onClick={() => { setPrompt("List the Students submitted Assignment-1") }} className='p-2 px-3 cursor-pointer rounded-2xl border border-tersiory/80'>List the Students submitted Assignment-1</div>
                <div onClick={() => { setPrompt("List all Teachers in this class") }} className='p-2 px-3 cursor-pointer rounded-2xl border border-tersiory/80'>List Teachers</div>
              </div>
            </div>
          }
          {thinking &&
            <div className='flex w-[50rem] justify-start'>
              <div className='p-2'>...</div>
            </div>
          }

    </div>
      </Scrollbars>
    {
    chats.length !== 0 &&
      <div className=' duration-300 p-2 rounded-md w-[50rem] flex-col flex bg-secondery items-center justify-center'>
        <form className='w-full flex h-full' onSubmit={handleGenerate}>
          <textarea placeholder='you can ask anything about this class , works and other complex prompts' onChange={(e) => setPrompt(e.target.value)} value={prompt} onKeyDown={handleEnter} name="input_area" className='w-full focus:outline-none rounded-md bg-transparent min-h-[3rem] max-h-[10rem] h-full'></textarea>
          <div className='flex w-fit px-3 items-end justify-end'>
            <button type='submit'>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-circle-fill text-light" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
              </svg>
            </button>
          </div>
        </form>
      </div>


  }
  <p className='font-extralight text-xs opacity-60'>VClass AI can make mistakes </p>
    </div >
  )
}

export default AIChat
