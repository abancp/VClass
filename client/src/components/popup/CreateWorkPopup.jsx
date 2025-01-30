import React from 'react'
import { Link } from 'react-router'

function CreateWorkPopup({handleClose,id}) {
  return (
    <div onClick={()=>handleClose()} className='w-screen  h-screen fixed top-0 left-0 z-[10000] flex justify-center items-center'>
      <div onClick={(e)=>{e.stopPropagation()}} className='flex flex-col gap-3 text-lg p-3 rounded-md border border border-tersiory/40 backdrop-blur-sm'>
        <Link to={"/class/"+id+"/add/assignment"} className='hover:bg-secondery p-1 px-2 cursor-pointer duration-300 rounded-md'>Assignment</Link>
        <Link to={"/class/"+id+"/add/quiz"} className='hover:bg-secondery p-1 px-2 cursor-pointer duration-300 rounded-md'>Quiz Assignment</Link>
        <h1 className='hover:bg-secondery p-1 px-2 cursor-pointer duration-300 rounded-md'>Question</h1>
        <h1 className='hover:bg-secondery p-1 px-2 cursor-pointer duration-300 rounded-md'>Meterial</h1>
      </div>
    </div>
  )
}

export default CreateWorkPopup
