import React from 'react'

function Notice({ notice, teacher, date }) {
  return (
    <div className={`p-2 cursor-pointer ${Math.random() < 0.5 ? "-rotate-2" : "rotate-2"} hover:rotate-0 transition-all duration-40 flex flex-col gap-3 border-red-300 m-3   border w-fit rounded-lg`}>

      <h1 >{notice}</h1>
      <div className='flex  gap-2'>
        <h6 className='text-xs '>{date}</h6>
        <h3 className='text-xs'>{teacher}</h3>
      </div>
    </div>
  )
}

export default Notice
