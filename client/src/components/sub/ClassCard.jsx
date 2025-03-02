import axios from 'axios'
import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router"
import { toast } from 'sonner'
import { SERVER_URL } from '../../config/SERVER_URL'

function ClassCard({ publicClasses, forHome, name, creater, creater_profile_url, subject, description, id, number_of_students, bg_url }) {
  const navigate = useNavigate()

  useEffect(() => { console.log(publicClasses) }, [])
  const handleClick = () => {
    if (!publicClasses) return
    navigate("/class/" + id)
    /*axios.post(SERVER_URL + "/class/public/join", { _id: id }, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success("Joined to class")
          navigate("/class/" + id)

        } else {
          toast.success(data.message)
        }
      })
      .catch(({ response }) => {
        navigate("/class/" + id)
      }
      )*/
  }
  return (
    <div className={`cursor-pointer relative flex bg-secondery/30 gap-2 p-1 ${publicClasses && "pb-2"} flex-col rounded-md w-[23rem] h-fit`}>
      <Link onClick={handleClick} to={forHome  ? "/" : "/class/" + id} className="h-[10rem] ">

        <img alt='' src={"/" + bg_url} className="cursor-pointer object-cover rounded-md h-[10rem] w-full" />
        <div class="group text-light p-5 mx-1 mt-1 pt-2 flex flex-col h-[10rem] items-start ease-in-out justify-start absolute inset-0 transition-all duration-300 rounded-md bg-gradient-to-r to-transparent from-secondery bg-size-200 hover:backdrop-blur-sm hover:bg-opacity-70 hover:bg-secondery hover:bg-pos-0 bg-pos-100">
          <div className='h-[4rem] w-full transition-all group-hover:h-0'></div>
          <div className='gap-3'>
            <div>
              <h1 className='font-bold text-2xl'>{name}</h1>
              <h1 className='font-semibold'>{subject}</h1>
            </div>
            <div className='font-light absolute  mt-2 text-sm duration-300 transform translate-y-10 opacity-0 group-hover:translate-y-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-in-out'>
              <h6>{description}</h6>
              {publicClasses || <h6>{number_of_students} students</h6>}
            </div>
          </div>

        </div>

      </Link>
      {
        publicClasses && <div className='w-full text-light'>
          <div className='w-full justify-between px-2 flex gap-1'>
            <div className='w-fit flex gap-2'>
              <img className='rounded-full w-[1.6rem]' src={creater_profile_url} referrerPolicy="no-referrer" alt="img" />
              <h1>{creater}</h1>
            </div>
            <h6>{number_of_students}M</h6>
          </div>
        </div>
      }
    </div>
  )
}

export default ClassCard
