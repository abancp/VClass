import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import ClassHome from '../components/class/ClassHome'
import Peoples from '../components/class/Peoples'
import Works from '../components/class/Works'
import Header from '../components/main/Header'
import Sidebar from '../components/main/Sidebar'
import { SERVER_URL } from '../config/SERVER_URL'

function ClassPage() {
  const [classData, setClassData] = useState({})
  const { id } = useParams()
  const [showSidebar, setShowSidebar] = useState(false)
  const [selected, setSelected] = useState('class')

  useEffect(() => {
    axios.get(SERVER_URL + "/class/" + id, { withCredentials: true })
      .then(({ data }) => {
        console.log(data)
        setClassData(data.class)
      })
  }, [id])


  return (
    <div className={`w-full flex-grow text-light pt-header ${showSidebar ? "pl-[12rem]" : "pl-[3rem]"} min-h-screen bg-dark transition-all duration-300`}>
      <Header sub={classData.name} sub1={selected.charAt(0).toUpperCase() + selected.slice(1)} forWhat="class" handleMenuClick={() => { setShowSidebar((prev) => !prev) }} />

      <Sidebar selected={selected} handleChange={(type) => setSelected(type)} full={showSidebar} forWhat={"class"} classname={classData.name} />

      {
        selected === "class" && <ClassHome classData={classData} id={id} />
      }
      {
        selected === 'works' && <Works id={id} />
      }
      {
        selected === 'peoples' && <Peoples id={id} />
      }
      {
        selected === "calender" &&
        <main></main>
      }
    </div>
  )
}

export default ClassPage
