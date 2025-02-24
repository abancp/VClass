import axios from 'axios'
import React, { useEffect } from 'react'
import { Link } from "react-router"
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'

function ClassCard({ publicClasses, forHome, name, subject, description, id, number_of_students, bg_url }) {
  useEffect(() => { console.log(publicClasses) }, [])
  const handleClick = () => {
    if (!publicClasses) return
    axios.post(SERVER_URL + "/class/public/join", { _id: id }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success("Joined to class")
          window.location.reload()
        }
      })
      .catch(() => toast.error("Something went wrong!"))

  }
  return (
    <div onClick={handleClick} className='cursor-pointer relative rounded-md w-[23rem] h-[10rem]'>
      <Link to={forHome || publicClasses ? "/" : "/class/" + id}>

        <img alt='' src={"/" + bg_url} className="cursor-pointer object-cover rounded-md h-full w-full" />
        <div class="group text-light p-5 pt-2 flex flex-col  items-start ease-in-out justify-start absolute inset-0 transition-all duration-300 rounded-md bg-gradient-to-r to-transparent from-secondery bg-size-200 hover:backdrop-blur-sm hover:bg-opacity-70 hover:bg-secondery hover:bg-pos-0 bg-pos-100">
          <div className='h-[4rem] w-full transition-all group-hover:h-0'></div>
          <div className='gap-3'>
            <div>
              <h1 className='font-bold text-2xl'>{name}</h1>
              <h1 className='font-semibold'>{subject}</h1>
            </div>
            <div className='font-light absolute  mt-2 text-sm duration-300 transform translate-y-10 opacity-0 group-hover:translate-y-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-in-out'>
              <h6>{description}</h6>
              <h6>{number_of_students} students</h6>

            </div>
          </div>

        </div>

      </Link>
    </div>
  )
}

export default ClassCard
