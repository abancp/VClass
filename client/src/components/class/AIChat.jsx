import React, { useState } from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"

function AIChat() {
  const [chats, setChats] = useState([])
  const [thinking, setThinking] = useState(false)
  const [prompt, setPrompt] = useState("")

  const handleGenerate = (e) => {
    e.preventDefault()
    if (thinking) return
    setPrompt("")
    setThinking(true)
    setChats((prev) => [...prev, { user: prompt }])
    axios.post(SERVER_URL + "/ai/gen", { prompt: prompt }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setThinking(false)
          setChats((prev) => [...prev, { ai: data.response }])
        }
      }).catch(() => { setThinking(false) })
  }

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleGenerate(e)
    }
  }

  return (
    <div className='w-full flex flex-col gap-2 items-center justify-end  p-3 h-[calc(100vh-3.5rem)] '>
      <div className='gap-3 items-center flex flex-col overflow-y-scroll h-[calc(100vh-10rem)] w-[50rem] p-3 w-full'>
        {
          chats.map((chat) => {
            let isUser = chat.user !== undefined;
            return (
              <div className={`flex w-[50rem] ${isUser ? " justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-4 p-2 ${isUser && "max-w-[45rem] bg-secondery/30"}`}>
                  {/*<ReactMarkdown remarkPlugins={[remarkGfm]}>{isUser ? chat.user : chat.ai}</ReactMarkdown>*/}
                  <p>{isUser ? chat.user : chat.ai}</p>
                </div>
              </div>
            );
          })
        }
        {thinking &&
          <div className='flex w-[50rem] justify-start'>
            <div className='p-2'>...</div>
          </div>
        }
      </div>
      <div className='cursor-pointer  duration-300 p-2 rounded-md w-[50rem] flex-col flex bg-secondery items-center justify-center'>
        <form className='w-full flex h-full' onSubmit={handleGenerate}>
          <textarea onChange={(e) => setPrompt(e.target.value)} value={prompt} onKeyDown={handleEnter} name="input_area" className='w-full focus:outline-none rounded-md bg-transparent min-h-[2rem] max-h-[10rem] h-full'></textarea>
          <div className='flex w-fit px-3 items-end justify-end'>
            <button type='submit'>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-up-circle-fill text-light" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <p className='font-extralight text-xs opacity-60'>VClass AI can make mistakes </p>
    </div >
  )
}

export default AIChat
