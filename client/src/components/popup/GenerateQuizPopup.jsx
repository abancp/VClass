import axios from 'axios'
import React, { useState } from 'react'
import { useDropzone } from "react-dropzone"
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'
import CheckAnimation from '../sub/CheckAnimation'
import FloatingCubeLoader from '../sub/Loading'

function GenerateQuizPopup({ handleClose, id, setQuiz }) {

  const [file, setFile] = useState()
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return
    setFile(acceptedFiles[0])
  }

  const { getInputProps, getRootProps } = useDropzone({ onDrop })


  const handleGenerate = (e) => {
    e.preventDefault()
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("MCQ", e.target.MCQ.value)
    formData.append("SHORT", e.target.SHORT.value)
    formData.append("DESCRIPTIVE", e.target.DESCRIPTIVE.value)
    axios.post(SERVER_URL + "/work/generate/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      withCredentials: true
    })
      .then(({ data }) => {
        setUploading(false)
        setSuccess(true)
        setQuiz(JSON.parse(data.quiz))
        setTimeout(()=>{handleClose()},1000)
      }).catch(() => {
        setSuccess(false)
        toast.error("something went wrong!")
      })

  }

  return (
    <div onClick={handleClose} className='bg-dark/70  w-screen backdrop-blur-sm  h-screen fixed top-0 left-0 z-[10000] flex justify-center items-center'>
      <div onClick={(e) => e.stopPropagation()} className='bg-secondery rounded-md w-[30rem] h-fit p-4'>
        {success ?
          <div className='h-[15rem] flex flex-col items-center justify-center'>
            <CheckAnimation />
          </div>
          : uploading ? <div className='h-[15rem] flex flex-col items-center justify-center'> <FloatingCubeLoader /></div> :
            <form onSubmit={handleGenerate} className='flex flex-col gap-2 justify-end w-full'>
              <div className='text-tersiory text-center cursor-pointer border-2 border-tersiory border-dotted w-full h-full rounded-md' {...getRootProps()}>
                <input className='w-full h-full'  {...getInputProps()} />
                <p className=' text-lg '>{file ? file.name?.slice(0, 25) + "..." + file.name?.slice(-4) : "Select Or Drop here"}</p>
              </div>
              <div className='flex justify-around'>
                <input name='MCQ' className=' border-b border-secondery focus:outline-none border-tersiory/30 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[9rem] p-1' type="number" placeholder='No MCQ' />
                <input name='SHORT' className=' border-b border-secondery focus:outline-none border-tersiory/30 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[9rem] p-1' type="number" placeholder='No SHORT' />
                <input name='DESCRIPTIVE' className=' border-b border-secondery focus:outline-none border-tersiory/30 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[9rem] p-1' type="number" placeholder='No DESCRIPTIVE' />
              </div>
              <button className='text-tersiory text-center flex justify-center items-center cursor-pointer bg-tersiory w-full h-[2rem] rounded-md'>
                <h1 className='text-lg font-semibold text-dark'>Generate</h1>
              </button>
            </form>
        }
      </div>

    </div >
  )
}

export default GenerateQuizPopup
