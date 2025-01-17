import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Header from '../components/main/Header'
import NoticeBoard from '../components/main/NoticeBoard'
import Sidebar from '../components/main/Sidebar'

function ClassPage() {
  const [classData, setClassData] = useState({})
  const { id } = useParams()
  const [showSidebar, setShowSidebar] = useState(false)
  const [selected, setSelected] = useState('class')

  useEffect(() => {
    axios.get("http://localhost:5000/class/" + id, { withCredentials: true })
      .then(({ data }) => {
        console.log(data)
        setClassData(data.class)
      })
  }, [id])

  return (
    <div className={`w-full text-light pt-header ${showSidebar ? "pl-[15rem]" : "pl-[3rem]"} min-h-screen bg-dark transition-all duration-300`}>
      <Header sub={classData.name} forWhat="class" handleMenuClick={() => { setShowSidebar((prev) => !prev) }} />
      <Sidebar selected={selected} handleChange={(type) => setSelected(type)} full={showSidebar} forWhat={"class"} classname={classData.name} />
      {selected === "class" &&
        <main className='p-4 flex gap-8 justify-center items-start'>
          <div className='w-[20rem] p-4 rounded-md flex flex-col gap-5 h-[8.5rem] border border-tersiory'>
            <div className='flex justify-between'>
              <h1 className="text-lg font-semibold">Class Key</h1>
              <div className='flex items-center gap-2 text-tersiory cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                </svg>
                <h1 className=" text-lg font-semibold">  copy invite link</h1>
              </div>
            </div>
            <h1 className='text-2xl bg-secondery rounded-md py-3 w-full text-center font-bold'>{classData.key}</h1>
          </div>
          <NoticeBoard notices={[{ notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" },
          { notice: "Schools opening today", teacher: "Aban Muhammed C P", date: "12/12/2024" }
          ]} />
        </main>
      }


      {
        selected === 'works' &&
        <main className='p-4 flex gap-8 justify-center items-start'>
          <div></div>
        </main>
      }

      {
        selected === 'peoples' &&
        <main className='p-4 flex flex-col gap-2 mb-2 justify-center items-start' >
          <h1 className='text-x py-2 rounded-md border border-tersiory px-4 font-bold'>Teachers</h1>
          <div className='py-2 ml-4 px-4 text-lg rounded-md bg-secondery'>Aban Muhammed C P</div>
        </main>
      }
    </div>
  )
}

export default ClassPage
