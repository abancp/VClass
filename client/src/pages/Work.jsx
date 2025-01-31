import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { useParams } from 'react-router'
import Header from '../components/main/Header'
import { SERVER_URL } from '../config/SERVER_URL'
function Work() {
  const [work, setWork] = useState({})
  const { work_type, work_id } = useParams()

  useEffect(() => {
  }, [])

  return (
    <div className='w-full text-light  h-full bg-dark pt-header min-h-screen'>
      <Header />
      <h1>Assignment 1</h1>
      <Markdown>must submit as pdf</Markdown>
    </div>
  )
}

export default Work
