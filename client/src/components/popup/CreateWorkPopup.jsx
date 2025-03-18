import React from 'react'
import { Link } from 'react-router'

function CreateWorkPopup({ handleClose, id }) {
  return (
    <div onClick={() => handleClose()} className='w-screen  h-screen fixed top-0 left-0  z-[100] flex justify-center items-center'>
      <div onClick={(e) => { e.stopPropagation() }} className='flex items-center w-[13rem] flex-col px[1] gap-3 text-lg p-4 border border-tersiory/50 rounded-md bg-secondery/50 backdrop-blur-md'>
        <Link to={"/class/" + id + "/add/assignment"} className='hover:bg-tersiory/80 p-1 text-center px-2 cursor-pointer duration-300 w-full rounded-md'>Assignment</Link>
        <Link to={"/class/" + id + "/add/quiz"} className='hover:bg-tersiory/80 p-1 text-center px-2 cursor-pointer duration-300 w-full  rounded-md'>Quiz</Link>
      </div>
    </div>
  )
}

export default CreateWorkPopup
