import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import AIChat from '../components/class/AIChat'
import AICalculator from '../components/class/AICalculator'
import ClassHome from '../components/class/ClassHome'
import Peoples from '../components/class/Peoples'
import Works from '../components/class/Works'
import Header from '../components/main/Header'
import Sidebar from '../components/main/Sidebar'
import { SERVER_URL } from '../config/SERVER_URL'
import MyCalendar from '../components/class/Calender'
import Footer from '../components/main/Footer'
import Settings from '../components/class/Settings'
import { transpose } from 'date-fns'
import ManageInfoPopup from '../components/popup/ManageInfoPopup'
import Doubts from '../components/class/Doubts'
import DraggableAIButton from '../components/sub/AIButton'
import Live from '../components/class/Live'
import VLab from '../components/class/VLab'
import Attendance from '../components/class/Attendance'
//TODO : Navigate sidebar tabes throgh urls 
function ClassPage() {
  const [chats, setChats] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [classData, setClassData] = useState({})
  const { id } = useParams()
  const [showSidebar, setShowSidebar] = useState(false)
  const [userRole, setUserRole] = useState('student')
  const [selected, setSelected] = useState(searchParams.get('tab') ? searchParams.get('tab') : 'class')
  const [showInfo, setShowInfo] = useState(false)
  const [peoples, setPeoples] = useState({ students: [], teachers: [] })

  useEffect(() => {
    axios.get(SERVER_URL + "/class/" + id, { withCredentials: true })
      .then(({ data }) => {
        console.log(data)
        setClassData(data.class)
        setUserRole(data.role)
      })
      .catch(({ response }) => {
        console.log(response)
        if (response.status === 401) {
          setShowInfo(true)
        }
      })
  }, [id])

  useEffect(() => {
    searchParams.set("tab", selected);
    setSearchParams(searchParams);
  }, [selected])

  useEffect(() => {
    const tabFromURL = searchParams.get("tab");
    if (tabFromURL !== selected) {
      setSelected(tabFromURL || "class");
    }
  }, [searchParams])

  return (
    <div className={`w-full flex-grow text-light pt-header ${showSidebar ? "pl-[12rem]" : "pl-[3rem]"} min-h-screen bg-dark transition-all duration-300`}>
      <Header
        sub={classData.name}
        sub1={selected === "vclass_ai" ? "VClass AI" : selected === "time_table" ? "Time Table" : selected.charAt(0).toUpperCase() + selected.slice(1).replace("_", " ")
        }
        forWhat="class"
        handleMenuClick={() => { setShowSidebar((prev) => !prev) }}
      />
      <DraggableAIButton id={id} />

      <Sidebar selected={selected} handleChange={(type) => { setSelected(type) }} full={showSidebar} forWhat={"class"} classname={classData.name} />

      {showInfo && <ManageInfoPopup id={id} visiter handleClose={() => setShowInfo(false)} />}

      {
        selected === "class" && <ClassHome role={userRole} classData={classData} id={id} />
      }
      {
        selected === 'live' && <Live role={userRole} id={id} />
      }
      {
        selected === 'doubts' && <Doubts role={userRole} id={id} />
      }
      {
        selected === 'works' && <Works role={userRole} id={id} />
      }
      {
        selected === 'vlab' && <VLab role={userRole} id={id} />
      }
      {
        selected === 'peoples' && <Peoples peoples={peoples} setPeoples={setPeoples} id={id} role={userRole} />
      }
      {
        selected === 'AI_calculator' && <AICalculator />
      }
      {
        selected === 'calender' && <MyCalendar id={id} />
      }
      {
        selected === 'attendance' && userRole === "teacher" && <Attendance role={userRole} peoples={peoples} setPeoples={setPeoples} id={id} />
      }
      {
        selected === 'settings' && <Settings id={id} />
      }
      {
        selected === "vclass_ai" && <AIChat chats={chats} setChats={setChats} id={id} />
      }
      {selected === "vclass_ai" || selected === 'AI_calculator' ? null : <Footer />}
    </div>
  )
}

export default ClassPage
