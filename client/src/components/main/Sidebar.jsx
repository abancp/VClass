import React, { useState } from 'react'
import { Link } from "react-router"

function Sidebar({ selected, full, classname, handleChange }) {
  return (
    <div className={`w-[15rem] fixed top-0 left-0 overflow-x-hidden justify-start items-end pt-20 flex flex-col gap-2 z-30 top-0 duration-300 bg-secondery h-screen  ${full ? 'w-[15rem]' : 'w-[3rem]'} `}>
      <Link to="/" className={` ${full ? "w-[14rem]" : "w-[2.7rem]"} flex justify-start items-center px-3 hover:border-tersiory rounded-l-md duration-300 cursor-pointer border-secondery gap-2 bg-dark/70 border-l border-y py-2`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
          <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
        </svg>
        {full && "Home"}
      </Link>
      <h1 className='text-lg text-center w-full font-semibold'> {full&&classname}</h1>


      <div onClick={() => handleChange("class")} className={`${selected === "class" ? " bg-dark  text-tersiory border-tersiory border-r-secondery" : " border-secondery bg-dark/70"} ${full ? "w-[14rem]" : "w-[2.7rem]"}   duration-300 px-3 flex items-center justify-start gap-2 rounded-l-md hover:border-tersiory  hover:text-tersiory cursor-pointer bg-dark border-l border-y  py-2`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-video3" viewBox="0 0 16 16">
          <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2" />
          <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783Q16 12.312 16 12V4a2 2 0 0 0-2-2z" />
        </svg>
        {full && "Class"}
      </div>

      <div onClick={() => handleChange("works")} className={`${selected === "works" ? "bg-dark  border-tersiory text-tersiory border-r-secondery" : "border-secondery bg-dark/70"} ${full ? "w-[14rem]" : "w-[2.7rem]"}  flex items-center justify-start gap-2 px-3 rounded-l-md hover:border-tersiory border-l border-y duration-300  cursor-pointer hover:text-tersiory  py-2`}>

        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clipboard2" viewBox="0 0 16 16">
          <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1z" />
          <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
        </svg>
        {full && "Works"}
      </div>



      <div onClick={() => handleChange("attendence")} className={`${selected === "attendence" ? "bg-dark text-tersiory border-tersiory  border-r-secondery" : "border-secondery bg-dark/70"}  ${full ? "w-[14rem]" : "w-[2.7rem]"}  flex items-center justify-start gap-2 w-[14rem] px-3 rounded-l-md hover:border-tersiory duration-300 cursor-pointer  border-l border-y hover:text-tersiory bg-dark py-2`}>

        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-card-checklist" viewBox="0 0 16 16">
  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
  <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
</svg>
        {full && "Attendence"}
      </div>

      <div onClick={() => handleChange("calender")} className={`${selected === "calender" ? "bg-dark text-tersiory border-tersiory  border-r-secondery" : "border-secondery bg-dark/70"}  ${full ? "w-[14rem]" : "w-[2.7rem]"}  flex items-center justify-start gap-2 w-[14rem] px-3 rounded-l-md hover:border-tersiory duration-300 cursor-pointer  border-l border-y hover:text-tersiory bg-dark py-2`}>

       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
</svg>        
        {full && "Calender"}
      </div>


      <div onClick={() => handleChange("peoples")} className={`${selected === "peoples" ? "bg-dark text-tersiory border-tersiory  border-r-secondery" : "border-secondery bg-dark/70"}  ${full ? "w-[14rem]" : "w-[2.7rem]"}  flex items-center justify-start gap-2 w-[14rem] px-3 rounded-l-md hover:border-tersiory duration-300 cursor-pointer  border-l border-y hover:text-tersiory bg-dark py-2`}>

        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
        {full && "Peoples"}
      </div>


    </div>
  )
}

export default Sidebar
