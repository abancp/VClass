import React, { useState } from 'react'

function Sidebar({ selected, full, classname, handleChange }) {
  return (
    <div className={`w-[15rem] fixed top-0 left-0 overflow-x-hidden justify-start items-end pt-20 flex flex-col gap-2 z-30 top-0 duration-300 bg-secondery h-screen  ${full ? 'w-[15rem]' : 'w-[3rem]'} `}>
      <div className='w-[14rem] px-3 border-tersiory rounded-l-md cursor-pointer bg-dark/70 hover:border py-2'>Home</div>
      <h1 className='text-lg text-center w-full font-semibold'> {classname}</h1>
      <div onClick={() => handleChange("class")} className={`${selected === "class" ? "border-l border-y  bg-dark" : "bg-dark/70"} w-[14rem] px-3 rounded-l-md border-tersiory hover:border cursor-pointer bg-dark  py-2`}>Class</div>
      <div onClick={() => handleChange("works")} className={`${selected === "works" ? "bg-dark  border-l border-y" : "bg-dark/70"} w-[14rem] px-3 rounded-l-md cursor-pointer border-tersiory  hover:border py-2`}>Works</div>
      <div onClick={() => handleChange("peoples")} className={`${selected === "peoples" ? "bg-dark border-l border-y" : "bg-dark/70"} w-[14rem] px-3 rounded-l-md cursor-pointer border-tersiory bg-dark hover:border py-2`}>Peoples</div>
    </div>
  )
}

export default Sidebar
