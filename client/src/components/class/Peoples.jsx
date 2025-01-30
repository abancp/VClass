import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../config/SERVER_URL'
import axios from 'axios'

function Peoples({ id }) {
  const [peoples, setPeoples] = useState({ students: [], teachers: [] })

  useEffect(() => {
    if (peoples?.teachers?.length === 0) {
      axios.get(SERVER_URL + "/class/peoples/" + id, { withCredentials: true })
        .then(({ data }) => {
          console.log(data)
          setPeoples(data.peoples)
        })
    }
  }, [peoples?.teachers?.length, id])

  return (
    <main className='p-4 flex flex-col gap-2 mb-2 justify-center items-start' >
      <h1 className='text-x py-2 rounded-md border border-tersiory px-4 font-bold'>Teachers</h1>
      {
        peoples?.teachers?.map((teacher) => (
          <div className='py-2 w-[20rem] ml-4 px-4 text-lg rounded-md bg-secondery'>{teacher}</div>
        ))
      }
      <h1 className='text-x  py-2 rounded-md border border-tersiory px-4 font-bold'>Students</h1>
      {
        peoples?.students?.map((student) => (
          <div className='py-2 w-[20rem] ml-4 px-4 text-lg rounded-md bg-secondery'>{student}</div>
        ))
      }

    </main>

  )
}

export default Peoples
